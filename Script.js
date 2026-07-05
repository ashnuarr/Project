(function(){
  const expertRoster = document.getElementById('expertRoster');
  const candidateRoster = document.getElementById('candidateRoster');
  const expertCount = document.getElementById('expertCount');
  const candidateCount = document.getElementById('candidateCount');
  const results = document.getElementById('results');

  const seedExperts = [
    { name: 'Dr. Amara Solis', tags: 'machine learning, statistics, NLP' },
    { name: 'Ravi Chandran', tags: 'distributed systems, backend infrastructure, databases' },
    { name: 'Lena Fischer', tags: 'product strategy, UX research, stakeholder management' }
  ];
  const seedCandidates = [
    { name: 'Candidate — J. Ortiz', tags: 'machine learning, computer vision, python' },
    { name: 'Candidate — S. Okafor', tags: 'backend infrastructure, distributed systems, kubernetes' }
  ];

  function makeRosterRow(container, name, tags, placeholderName, placeholderTags){
    const row = document.createElement('div');
    row.className = 'roster-row';
    row.innerHTML = `
      <input type="text" class="name-field" placeholder="${placeholderName}" value="${escapeHtml(name||'')}">
      <input type="text" class="tags-field" placeholder="${placeholderTags}" value="${escapeHtml(tags||'')}">
      <button class="icon-btn remove-btn" title="Remove" aria-label="Remove">✕</button>
    `;
    row.querySelector('.remove-btn').addEventListener('click', ()=>{
      row.remove();
      updateCounts();
    });
    container.appendChild(row);
    updateCounts();
  }

  function escapeHtml(str){
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function updateCounts(){
    expertCount.textContent = expertRoster.children.length + (expertRoster.children.length===1 ? ' expert' : ' experts');
    candidateCount.textContent = candidateRoster.children.length + (candidateRoster.children.length===1 ? ' candidate' : ' candidates');
  }

  document.getElementById('addExpert').addEventListener('click', ()=>{
    makeRosterRow(expertRoster, '', '', 'Panel member name', 'Areas of expertise, comma separated');
  });
  document.getElementById('addCandidate').addEventListener('click', ()=>{
    makeRosterRow(candidateRoster, '', '', 'Candidate name', 'Area of expertise, comma separated');
  });

  seedExperts.forEach(e => makeRosterRow(expertRoster, e.name, e.tags, 'Panel member name', 'Areas of expertise, comma separated'));
  seedCandidates.forEach(c => makeRosterRow(candidateRoster, c.name, c.tags, 'Candidate name', 'Area of expertise, comma separated'));

  // ---- Relevance scoring ----
  function tokenize(str){
    return (str||'')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);
  }

  function termOverlapScore(setA, setB){
    if(setA.length===0 || setB.length===0) return 0;
    let hits = 0;
    setA.forEach(a=>{
      const matched = setB.some(b => a===b || a.includes(b) || b.includes(a));
      if(matched) hits++;
    });
    let hitsB = 0;
    setB.forEach(b=>{
      const matched = setA.some(a => a===b || a.includes(b) || b.includes(a));
      if(matched) hitsB++;
    });
    const overlapScore = ((hits + hitsB) / 2) / Math.max(setA.length, setB.length);
    return Math.min(1, overlapScore);
  }

  function verdictFor(score){
    if(score >= 0.7) return {label:'Strong Match', cls:'strong'};
    if(score >= 0.4) return {label:'Partial Match', cls:'partial'};
    return {label:'Mismatch', cls:'mismatch'};
  }

  function colorForScore(score){
    if(score >= 0.7) return getComputedStyle(document.documentElement).getPropertyValue('--sage');
    if(score >= 0.4) return getComputedStyle(document.documentElement).getPropertyValue('--gold');
    return getComputedStyle(document.documentElement).getPropertyValue('--rust');
  }

  document.getElementById('computeBtn').addEventListener('click', ()=>{
    const subjectTags = tokenize(document.getElementById('subjectInput').value);

    const experts = Array.from(expertRoster.children).map(row=>{
      const name = row.querySelector('.name-field').value.trim() || 'Unnamed panel member';
      const tags = tokenize(row.querySelector('.tags-field').value);
      return { name, tags };
    }).filter(e => e.tags.length > 0);

    const candidates = Array.from(candidateRoster.children).map(row=>{
      const name = row.querySelector('.name-field').value.trim() || 'Unnamed candidate';
      const tags = tokenize(row.querySelector('.tags-field').value);
      return { name, tags };
    }).filter(c => c.tags.length > 0);

    results.innerHTML = '';

    if(experts.length===0 || candidates.length===0){
      results.innerHTML = '<div class="empty-note">Add at least one panel member and one candidate, each with expertise tags, to compute relevance.</div>';
      return;
    }

    candidates.forEach(candidate=>{
      const block = document.createElement('div');
      block.className = 'candidate-block';
      block.innerHTML = `<h3>${escapeHtml(candidate.name)}</h3><div class="sub">${escapeHtml(candidate.tags.join(' · '))}</div>`;
      results.appendChild(block);

      const cardsRow = document.createElement('div');
      cardsRow.className = 'cards-row';

      const scored = experts.map(expert=>{
        const candidateMatch = termOverlapScore(expert.tags, candidate.tags);
        const subjectMatch = subjectTags.length ? termOverlapScore(expert.tags, subjectTags) : candidateMatch;
        const finalScore = subjectTags.length ? (0.6*candidateMatch + 0.4*subjectMatch) : candidateMatch;
        return { expert, finalScore };
      });

      const maxScore = Math.max(...scored.map(s=>s.finalScore));

      scored
        .sort((a,b)=> b.finalScore - a.finalScore)
        .forEach(({expert, finalScore})=>{
          const pct = Math.round(finalScore*100);
          const verdict = verdictFor(finalScore);
          const isBest = finalScore === maxScore && finalScore > 0;
          const card = document.createElement('div');
          card.className = 'verdict-card' + (isBest ? ' best' : '');
          card.innerHTML = `
            <div class="stamp ${verdict.cls}">${verdict.label}</div>
            <div class="expert-name">${escapeHtml(expert.name)}</div>
            <div class="expert-tags">${escapeHtml(expert.tags.join(' · '))}</div>
            <div class="score-line">
              <span class="score-num">${pct}</span><span class="score-pct">/ 100 fit</span>
            </div>
            <div class="meter"><div class="meter-fill" style="width:${pct}%; background:${colorForScore(finalScore)}"></div></div>
          `;
          cardsRow.appendChild(card);
        });

      results.appendChild(cardsRow);
    });

    results.scrollIntoView({behavior:'smooth', block:'start'});
  });
})();
