/* ═══════════════════════════════════════════════════════════════
   THE BUILDER PROTOCOL — SUBMISSION MATRIX
   Interactive Logic & Runtime
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ──────────────────────────────────────────
  // SYSTEM CLOCK
  // ──────────────────────────────────────────
  const clockEl = document.getElementById('sysClock');

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // ──────────────────────────────────────────
  // SESSION ID GENERATOR
  // ──────────────────────────────────────────
  const sessionEl = document.getElementById('sysSession');

  function generateSessionId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'SES_';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  sessionEl.textContent = generateSessionId();

  // ──────────────────────────────────────────
  // DOM REFERENCES
  // ──────────────────────────────────────────
  const authorName = document.getElementById('authorName');
  const authorEmail = document.getElementById('authorEmail');
  const authorAffiliation = document.getElementById('authorAffiliation');
  const authorRole = document.getElementById('authorRole');
  const streamSelect = document.getElementById('streamSelect');
  const headlineField = document.getElementById('headlineField');
  const abstractField = document.getElementById('abstractField');
  const bodyField = document.getElementById('bodyField');
  const charCounter = document.getElementById('charCounter');
  const submitBtn = document.getElementById('submitBtn');
  const compilerStatusValue = document.getElementById('compilerStatusValue');
  const compilerHash = document.getElementById('compilerHash');
  const sysStatus = document.getElementById('sysStatus');
  const protocolStatus = document.getElementById('protocolStatus');
  const footerWordCount = document.getElementById('footerWordCount');

  const checkOriginal = document.getElementById('checkOriginal');
  const checkRights = document.getElementById('checkRights');
  const checkLicense = document.getElementById('checkLicense');
  const checkAccuracy = document.getElementById('checkAccuracy');
  const checkEthics = document.getElementById('checkEthics');

  const steps = document.querySelectorAll('.step');

  // ──────────────────────────────────────────
  // CHARACTER & WORD COUNTER
  // ──────────────────────────────────────────
  function updateCounters() {
    const len = bodyField.value.length;
    const isValid = len >= 500;

    charCounter.textContent = `CHARS: ${len} / MIN: 500`;
    charCounter.classList.toggle('char-counter--valid', isValid);

    // Word count for footer
    const allText = [headlineField.value, abstractField.value, bodyField.value].join(' ');
    const words = allText.trim().split(/\s+/).filter(w => w.length > 0).length;
    footerWordCount.textContent = `WORDS: ${words}`;
  }

  bodyField.addEventListener('input', updateCounters);
  headlineField.addEventListener('input', updateCounters);
  abstractField.addEventListener('input', updateCounters);

  // ──────────────────────────────────────────
  // STEP TRACKER — Highlight active step
  // ──────────────────────────────────────────
  function updateStepTracker() {
    // Step 1: Identity
    const step1Done = authorName.value.trim() !== '' && authorEmail.value.trim() !== '';
    // Step 2: Stream
    const step2Done = streamSelect.value !== '';
    // Step 3: Manuscript
    const step3Done = headlineField.value.trim() !== '' && bodyField.value.length >= 500;
    // Step 4: Licensing
    const step4Done = checkOriginal.checked && checkRights.checked && checkLicense.checked && checkAccuracy.checked && checkEthics.checked;
    // Step 5: Ready to transmit
    const step5Done = step1Done && step2Done && step3Done && step4Done;

    const statuses = [step1Done, step2Done, step3Done, step4Done, step5Done];

    steps.forEach((step, i) => {
      step.classList.remove('step--active', 'step--complete');
      if (statuses[i]) {
        step.classList.add('step--complete');
      }
    });

    // Find the first incomplete step and mark it active
    const firstIncomplete = statuses.indexOf(false);
    if (firstIncomplete >= 0 && firstIncomplete < steps.length) {
      steps[firstIncomplete].classList.add('step--active');
    }

    // Update protocol status
    const completedCount = statuses.filter(Boolean).length;
    protocolStatus.textContent = `${completedCount}/5 COMPLETE`;

    // Update compiler status
    if (step5Done) {
      compilerStatusValue.textContent = 'ALL CHECKS PASSED — READY TO COMMIT';
      compilerStatusValue.className = 'action-compiler__status-value status--ready';
      submitBtn.disabled = false;
      sysStatus.textContent = 'PAYLOAD READY — COMMIT WHEN READY';
    } else {
      const missing = [];
      if (!step1Done) missing.push('IDENTITY');
      if (!step2Done) missing.push('STREAM');
      if (!step3Done) missing.push('MANUSCRIPT');
      if (!step4Done) missing.push('DECLARATIONS');
      compilerStatusValue.textContent = `MISSING: ${missing.join(', ')}`;
      compilerStatusValue.className = 'action-compiler__status-value';
      submitBtn.disabled = true;
      sysStatus.textContent = 'SYSTEM READY — AWAITING PAYLOAD';
    }
  }

  // Bind all relevant inputs to step tracker
  [authorName, authorEmail, authorAffiliation, authorRole, streamSelect,
   headlineField, abstractField, bodyField,
   checkOriginal, checkRights, checkLicense, checkAccuracy, checkEthics
  ].forEach(el => {
    el.addEventListener('input', updateStepTracker);
    el.addEventListener('change', updateStepTracker);
  });

  // Initial state
  updateStepTracker();

  // ──────────────────────────────────────────
  // TOOLBAR — Markdown insertion
  // ──────────────────────────────────────────
  document.querySelectorAll('.editor-toolbar .toolbar-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const insertText = this.getAttribute('data-insert');
      const isWrap = this.getAttribute('data-wrap') === 'true';

      const start = bodyField.selectionStart;
      const end = bodyField.selectionEnd;
      const selected = bodyField.value.substring(start, end);
      const before = bodyField.value.substring(0, start);
      const after = bodyField.value.substring(end);

      if (isWrap && selected) {
        bodyField.value = before + insertText + selected + insertText + after;
        bodyField.selectionStart = start;
        bodyField.selectionEnd = end + insertText.length * 2;
      } else {
        bodyField.value = before + insertText + after;
        bodyField.selectionStart = bodyField.selectionEnd = start + insertText.length;
      }

      bodyField.focus();
      bodyField.dispatchEvent(new Event('input'));
    });
  });

  // ──────────────────────────────────────────
  // CO-AUTHORS — Add / Remove
  // ──────────────────────────────────────────
  const addCoAuthorBtn = document.getElementById('addCoAuthor');
  const coAuthorsList = document.getElementById('coAuthorsList');

  addCoAuthorBtn.addEventListener('click', function () {
    const index = coAuthorsList.children.length;
    const row = document.createElement('div');
    row.className = 'co-author-row';
    row.setAttribute('data-index', index);
    row.innerHTML = `
      <input type="text" class="field-input co-author-name" placeholder="Co-author name" />
      <input type="email" class="field-input co-author-email" placeholder="email@domain" />
      <button class="toolbar-btn co-author-remove" title="Remove">×</button>
    `;
    coAuthorsList.appendChild(row);

    row.querySelector('.co-author-remove').addEventListener('click', function () {
      row.remove();
    });
  });

  // Remove handler for initial co-author row
  document.querySelectorAll('.co-author-remove').forEach(btn => {
    btn.addEventListener('click', function () {
      const row = this.closest('.co-author-row');
      if (coAuthorsList.children.length > 1) {
        row.remove();
      } else {
        row.querySelectorAll('input').forEach(inp => { inp.value = ''; });
      }
    });
  });

  // ──────────────────────────────────────────
  // TAB KEY IN BODY — Insert spaces
  // ──────────────────────────────────────────
  bodyField.addEventListener('keydown', function (e) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = this.selectionStart;
      const end = this.selectionEnd;
      this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
      this.selectionStart = this.selectionEnd = start + 2;
      this.dispatchEvent(new Event('input'));
    }
  });

  // ──────────────────────────────────────────
  // SUBMIT — Payload Transmission
  // ──────────────────────────────────────────
  function generateHash() {
    const chars = '0123456789abcdef';
    let hash = '';
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  submitBtn.addEventListener('click', function () {
    if (this.disabled) return;

    // Gather co-authors
    const coAuthors = [];
    document.querySelectorAll('.co-author-row').forEach(row => {
      const name = row.querySelector('.co-author-name').value.trim();
      const email = row.querySelector('.co-author-email').value.trim();
      if (name || email) {
        coAuthors.push({ name, email });
      }
    });

    // Build payload object
    const payload = {
      session: sessionEl.textContent,
      timestamp: new Date().toISOString(),
      author: {
        name: authorName.value.trim(),
        email: authorEmail.value.trim(),
        affiliation: authorAffiliation.value.trim(),
        orcid: document.getElementById('authorOrcid').value.trim(),
        region: document.getElementById('authorCountry').value.trim(),
        url: document.getElementById('authorWebsite').value.trim(),
        role: authorRole.value,
      },
      coAuthors,
      stream: streamSelect.value,
      manuscript: {
        headline: headlineField.value.trim(),
        abstract: abstractField.value.trim(),
        body: bodyField.value,
        tags: document.getElementById('manuscriptTags').value.trim(),
        language: document.getElementById('manuscriptLang').value,
        format: document.getElementById('manuscriptType').value,
      },
      references: {
        repo: document.getElementById('refRepo').value.trim(),
        demo: document.getElementById('refDemo').value.trim(),
        data: document.getElementById('refData').value.trim(),
      },
      declarations: {
        original: checkOriginal.checked,
        rights: checkRights.checked,
        license: checkLicense.checked,
        accuracy: checkAccuracy.checked,
        ethics: checkEthics.checked,
      },
    };

    // Simulate transmission
    const txHash = generateHash();

    submitBtn.textContent = '[ TRANSMITTING... ]';
    submitBtn.disabled = true;
    compilerStatusValue.textContent = 'COMPILING PAYLOAD...';
    compilerStatusValue.className = 'action-compiler__status-value';
    sysStatus.textContent = 'TRANSMITTING PAYLOAD...';
    sysStatus.style.animation = 'none';

    // Log payload to console
    console.log('═══════════════════════════════════════');
    console.log('TBP SUBMISSION PAYLOAD');
    console.log('═══════════════════════════════════════');
    console.log(JSON.stringify(payload, null, 2));
    console.log(`TX_HASH: ${txHash}`);
    console.log('═══════════════════════════════════════');

    setTimeout(() => {
      submitBtn.textContent = '[ PAYLOAD COMMITTED SUCCESSFULLY ]';
      submitBtn.classList.add('btn--success');
      compilerStatusValue.textContent = 'TRANSMISSION COMPLETE — HASH GENERATED';
      compilerStatusValue.className = 'action-compiler__status-value status--ready';
      compilerHash.textContent = `TX_HASH: ${txHash}`;
      sysStatus.textContent = `TRANSMITTED — HASH: ${txHash.substring(0, 16)}...`;
      sysStatus.style.animation = '';
      protocolStatus.textContent = 'COMMITTED';

      // Mark step 5 complete
      steps[4].classList.remove('step--active');
      steps[4].classList.add('step--complete');

      // Reset after delay
      setTimeout(() => {
        submitBtn.textContent = '[ COMMIT MANUSCRIPT PAYLOAD // TRANSMIT ]';
        submitBtn.classList.remove('btn--success');
        updateStepTracker();
      }, 5000);
    }, 2000);
  });

  // ──────────────────────────────────────────
  // INITIAL COUNTER UPDATE
  // ──────────────────────────────────────────
  updateCounters();

})();

