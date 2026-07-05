function findMatch() {

    let candidateName = document.getElementById("candidateName").value.trim();
    let candidateSubject = document.getElementById("candidateSubject").value;
    let candidateSkill = document.getElementById("candidateSkill").value;
    let expertSubject = document.getElementById("expertSubject").value;

    let output = document.getElementById("output");

    if (
        candidateName === "" ||
        candidateSubject === "" ||
        candidateSkill === "" ||
        expertSubject === ""
    ) {
        output.innerHTML = "⚠ Please fill all the fields.";
        output.style.color = "red";
        return;
    }

    let percentage = 0;

    if (candidateSubject === expertSubject) {
        percentage += 60;
    }

    if (candidateSkill === expertSubject) {
        percentage += 40;
    }

    if (percentage === 100) {
        output.style.color = "green";
        output.innerHTML =
            "✅ Perfect Match!<br><br>" +
            "Candidate: <b>" + candidateName + "</b><br>" +
            "Recommended Expert: <b>" + expertSubject + "</b><br>" +
            "Match Percentage: <b>100%</b>";
    }
    else if (percentage >= 60) {
        output.style.color = "orange";
        output.innerHTML =
            "🟡 Good Match<br><br>" +
            "Candidate: <b>" + candidateName + "</b><br>" +
            "Recommended Expert: <b>" + expertSubject + "</b><br>" +
            "Match Percentage: <b>" + percentage + "%</b>";
    }
    else {
        output.style.color = "red";
        output.innerHTML =
            "❌ Poor Match<br><br>" +
            "Candidate: <b>" + candidateName + "</b><br>" +
            "Selected Expert: <b>" + expertSubject + "</b><br>" +
            "Match Percentage: <b>" + percentage + "%</b><br>" +
            "Please choose a more suitable expert.";
    }
}
