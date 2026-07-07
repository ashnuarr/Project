function findMatch() {
    // 1. Safely retrieve DOM elements
    const candidateNameEl = document.getElementById("candidateName");
    const candidateSubjectEl = document.getElementById("candidateSubject");
    const candidateSkillEl = document.getElementById("candidateSkill");
    const expertSubjectEl = document.getElementById("expertSubject");
    const outputEl = document.getElementById("output");

    // Prevent errors if elements don't exist in the HTML yet
    if (!candidateNameEl || !candidateSubjectEl || !candidateSkillEl || !expertSubjectEl || !outputEl) {
        console.error("⚠ Error: One or more required DOM elements are missing.");
        return;
    }

    // 2. Retrieve values and trim outer whitespace
    const candidateName = candidateNameEl.value.trim();
    const candidateSubject = candidateSubjectEl.value.trim();
    const candidateSkill = candidateSkillEl.value.trim();
    const expertSubject = expertSubjectEl.value.trim();

    // 3. Validation: Check if any fields are empty
    if (
        candidateName === "" ||
        candidateSubject === "" ||
        candidateSkill === "" ||
        expertSubject === ""
    ) {
        outputEl.innerHTML = "⚠ Please fill all the fields.";
        outputEl.style.color = "red";
        return;
    }

    let percentage = 0;
    
    // Lowercase strings for case-insensitive comparison
    const expertSubjectLower = expertSubject.toLowerCase();

    // 4. Calculate match percentage
    if (candidateSubject.toLowerCase() === expertSubjectLower) {
        percentage += 60;
    }

    if (candidateSkill.toLowerCase() === expertSubjectLower) {
        percentage += 40;
    }

    // 5. Output results
    if (percentage === 100) {
        outputEl.style.color = "green";
        outputEl.innerHTML = `
            ✅ Perfect Match!<br><br>
            Candidate: <b>${candidateName}</b><br>
            Recommended Expert: <b>${expertSubject}</b><br>
            Match Percentage: <b>100%</b>
        `;
    } else if (percentage >= 60) {
        outputEl.style.color = "orange";
        outputEl.innerHTML = `
            🟡 Good Match<br><br>
            Candidate: <b>${candidateName}</b><br>
            Recommended Expert: <b>${expertSubject}</b><br>
            Match Percentage: <b>${percentage}%</b>
        `;
    } else {
        outputEl.style.color = "red";
        outputEl.innerHTML = `
            ❌ Poor Match<br><br>
            Candidate: <b>${candidateName}</b><br>
            Selected Expert: <b>${expertSubject}</b><br>
            Match Percentage: <b>${percentage}%</b><br>
            Please choose a more suitable expert.
        `;
    }
}
