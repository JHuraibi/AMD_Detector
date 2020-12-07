class AmslerGridDAO {
    constructor(dbRef, userID) {
        this.dbRef = dbRef;
        this.userID = userID;
        this.docList = [];

        // // !! TODO: This value to be dynamically set
        // this.canvasSize = 800;

        // These values are equal to 20, 45, and 95% opacity levels respectively
        // Max alpha in hex is FF or 255 in decimal
        // e.g. [Hex F3 == Dec 243]
        // 			(243 / 255) -> 95%
        //			(F3 / FF)   -> 95%
        this.alphaLevels = ["33", "73", "F3"];
        this.leftAlphaIndex = 0;
        this.rightAlphaIndex = 0;
        this.useAlpha = false;
    }

    async loadAll() {
        await this.dbRef
            .collection("TestResults")
            .doc(this.userID)
            .collection("AmslerGrid")
            .orderBy("TimeStampMS", "desc")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let extractedDoc = this.extractor(doc.id, doc.data());
                    this.docList.push(extractedDoc);
                });
            });

        // this.manualAdd();
    }

    // !! TESTING ONLY - Clones FireStore doc from existing
    manualAdd() {
        this.dbRef.collection("TestResults")
            .doc(this.userID)
            .collection("AmslerGrid")
            .add(this.docList[0])
            .then(() => {
                console.log("Manual document added.");
            });
    }

    // NOTE: The JSON returned needs to match the FireStore document structure for Amsler Grid
    extractor(id, data) {
        return {
            id: id,
            TestName: data.TestName,
            TimeStampMS: data.TimeStampMS,
            Eye: data.AmslerQuestions.q1.value,
            Section1: data.sec1Answers,
            Section2: data.sec2Answers,
            Section3: data.sec3Answers,
            Section4: data.sec4Answers,
        }

    }

    insert(data)
    {
        document.getElementById('sq1').placeholer = data.sec1Answers;
        document.getElementById('sq2').placeholer = data.sec2Answers;
        document.getElementById('sq3').placeholer = data.sec3Answers;
        document.getElementById('sq4').placeholer = data.sec4Answers;


    }

    populateHistoryTable(targetTableID) {
        if (!this.userID) {
            console.log("User ID is null");
            return;
        }

        for (let i = 0; i < this.docList.length; i++) {
            let doc = this.docList[i];
            let timeStamp = doc.TimeStampMS;
            this.addRowToTable(doc.id, timeStamp, targetTableID);
        }
    }

    // TODO: Update with actual method for detailed view
    // TODO: Refactor variable names below to be more readable
    addRowToTable(docID, timeStamp, targetTableID) {
        let testName = "Amsler Grid";
        let time = this.formatDate(timeStamp);
        let urlOfDetailedView = this.URIBuilder(docID);

        // ID of which table to put the data into (HTML Attribute ID)
        let tableBody = document.getElementById(targetTableID);

        // Table Row
        let row = document.createElement("tr");

        // Table Columns
        let columnTestName = document.createElement("td");
        let columnTime = document.createElement("td");
        let columnID = document.createElement("td");

        // Will be a child of columnURL so we can add hyperlink
        let linkForDetailedView = document.createElement("a");

        // Text to be put in the Columns
        let textTestName = document.createTextNode(testName);
        let textTime = document.createTextNode(time);
        let textID = document.createTextNode("Details");

        // Set href attribute for link to test
        linkForDetailedView.appendChild(textID);
        linkForDetailedView.setAttribute("href", urlOfDetailedView);

        // Put the Text into their respective Columns
        columnTestName.appendChild(textTestName);
        columnTime.appendChild(textTime);
        columnID.appendChild(linkForDetailedView);

        // Add each the Columns to the Row
        row.appendChild(columnTestName);
        row.appendChild(columnTime);
        row.appendChild(columnID);

        // Add the Row to the Table
        tableBody.appendChild(row);
    }

    URIBuilder(docID) {
        let uri = new URLSearchParams();
        uri.append("TEST_NAME", "Amsler Grid");
        uri.append("TEST_ID", docID);
        return "./dashboard/detailed_view.html?" + uri.toString();
    }

    setIndex(ms) {
        let length = this.docList.length;
        let i = 0;

        // CHECK: Remove "or equal"?
        while (this.docList[i].TimeStampMS >= ms && i < length - 1) {
            i++;
        }

        return i;
    }

    checkBeforeDate() {

    }

    alphaCreator(num) {
        let n = 255 / num;
    }

    formatDate(milliseconds) {
        let date = new Date(milliseconds);
        let timezoneOffset = -5;	// UTC -5:00

        let dateString = date.toDateString();
        let hoursString = +date.getUTCHours() + timezoneOffset;
        let minutesString = date.getUTCMinutes();
        let postfix = hoursString > 11 ? "PM" : "AM";

        if (hoursString === 0) {
            hoursString = 12;
        }

        minutesString = minutesString < 10 ? "0" + minutesString : minutesString;
        hoursString = hoursString % 12;

        // Uncomment below line to add time of day
        // return dateString + " at " + hoursString + ":" + minutesString + postfix;
        return dateString;
    }

    // TODO: docstring
    // TODO: Better year handling (abs, then mod 12 for number of years)
    monthMSHelper(current, number) {
        // !! TODO: ERROR HANDLING
        let year = 2020;
        if (current - number < 0) {
            year = year - 1;
        }

        let month = (current + (11 - number)) % 12;

        return Date.UTC(year, month, 1);
    }

    monthName(number) {
        if (number < 0 || number > 12) {
            console.log("Month number invalid. Number: " + number);
            return "January";
        }

        let months = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ];

        return months[number];
    }

}// class [ AmslerDAO ]