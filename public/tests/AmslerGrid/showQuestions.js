var db = firebase.firestore();



async function loadAll() {
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

function extractor(id, data) {
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
