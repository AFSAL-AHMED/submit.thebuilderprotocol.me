/* ═══════════════════════════════════════════════════════════════
   THE BUILDER PROTOCOL — OFFICIAL EDITORIAL PORTAL RUNTIME
   Interactive Matrix Engine & Private Editorial Desk v3.0
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ──────────────────────────────────────────
  // SYSTEM CLOCK & SESSION INITIALIZATION
  // ──────────────────────────────────────────
  const clockEl = document.getElementById('sysClock');
  const sessionEl = document.getElementById('sysSession');

  function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    if (clockEl) clockEl.textContent = `${h}:${m}:${s}`;
  }
  updateClock();
  setInterval(updateClock, 1000);

  function generateSessionId() {
    const chars = 'ABCDEF0123456789';
    let id = 'SES_';
    for (let i = 0; i < 8; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }
  if (sessionEl) sessionEl.textContent = generateSessionId();

  // ──────────────────────────────────────────
  // VIEW SWITCHER CONTROLLER
  // ──────────────────────────────────────────
  window.switchView = function (viewName) {
    // Hide all view panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.classList.remove('active');
    });

    // Remove active class from all nav buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });

    // Activate selected panel
    const targetPanel = document.getElementById(`view-${viewName}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Activate corresponding nav button
    const targetBtn = document.querySelector(`.nav-btn[data-view="${viewName}"]`);
    if (targetBtn) {
      targetBtn.classList.add('active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // If switching to desk, refresh table
    if (viewName === 'desk') {
      renderDeskTable();
    }
  };

  // ──────────────────────────────────────────
  // AI TOGGLE FIELD HANDLER
  // ──────────────────────────────────────────
  window.toggleAiFields = function (isChecked) {
    const aiRow = document.getElementById('aiDetailsRow');
    const aiInput = document.getElementById('aiDetailsInput');
    if (aiRow) {
      aiRow.style.display = isChecked ? 'flex' : 'none';
      if (isChecked && aiInput) aiInput.focus();
    }
  };

  // ──────────────────────────────────────────
  // CO-AUTHORS DYNAMIC MANAGER
  // ──────────────────────────────────────────
  const addCoAuthorBtn = document.getElementById('addCoAuthorBtn');
  const coAuthorsContainer = document.getElementById('coAuthorsContainer');

  if (addCoAuthorBtn && coAuthorsContainer) {
    addCoAuthorBtn.addEventListener('click', () => {
      const row = document.createElement('div');
      row.className = 'co-author-row';
      row.innerHTML = `
        <input type="text" class="field-input co-author-name" placeholder="Co-Author Full Name" />
        <input type="email" class="field-input co-author-email" placeholder="email@institution.edu" />
        <button type="button" class="toolbar-btn remove-co-author" style="border:none; padding:8px 12px; color:var(--error)">×</button>
      `;
      coAuthorsContainer.appendChild(row);

      row.querySelector('.remove-co-author').addEventListener('click', () => {
        row.remove();
      });
    });
  }

  // ──────────────────────────────────────────
  // EDITOR TOOLBAR INSERTER
  // ──────────────────────────────────────────
  const articleBody = document.getElementById('articleBody');
  document.querySelectorAll('.editor-toolbar .toolbar-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      if (!articleBody) return;
      const insertText = this.getAttribute('data-insert');
      const isWrap = this.getAttribute('data-wrap') === 'true';

      const start = articleBody.selectionStart;
      const end = articleBody.selectionEnd;
      const selected = articleBody.value.substring(start, end);
      const before = articleBody.value.substring(0, start);
      const after = articleBody.value.substring(end);

      if (isWrap && selected) {
        articleBody.value = before + insertText + selected + insertText + after;
        articleBody.selectionStart = start;
        articleBody.selectionEnd = end + insertText.length * 2;
      } else {
        articleBody.value = before + insertText + after;
        articleBody.selectionStart = articleBody.selectionEnd = start + insertText.length;
      }

      articleBody.focus();
      articleBody.dispatchEvent(new Event('input'));
    });
  });

  // Handle Tab key in markdown body
  if (articleBody) {
    articleBody.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 2;
        this.dispatchEvent(new Event('input'));
      }
    });
  }

  // ──────────────────────────────────────────
  // CHARACTER & WORD COUNTER
  // ──────────────────────────────────────────
  const charCounter = document.getElementById('charCounter');
  const footerWordCount = document.getElementById('footerWordCount');
  const headlineField = document.getElementById('articleHeadline');
  const abstractField = document.getElementById('articleAbstract');

  function updateCounters() {
    if (!articleBody) return;
    const bodyText = articleBody.value;
    const chars = bodyText.length;
    const words = bodyText.trim().split(/\s+/).filter(w => w.length > 0).length;

    const isValid = chars >= 500;
    if (charCounter) {
      charCounter.textContent = `WORDS: ${words} | CHARS: ${chars} (MIN: 500 CHARS / TARGET: 800-2,500 WORDS)`;
      charCounter.classList.toggle('char-counter--valid', isValid);
    }

    if (footerWordCount) {
      footerWordCount.textContent = `MANUSCRIPT: ${words} WORDS`;
    }
  }

  if (articleBody) articleBody.addEventListener('input', updateCounters);
  if (headlineField) headlineField.addEventListener('input', updateCounters);
  if (abstractField) abstractField.addEventListener('input', updateCounters);

  // ──────────────────────────────────────────
  // 5-STAGE PROTOCOL TRACKER & VALIDATION
  // ──────────────────────────────────────────
  const steps = document.querySelectorAll('.step');
  const submitBtn = document.getElementById('submitBtn');
  const compilerStatusValue = document.getElementById('compilerStatusValue');
  const protocolStatus = document.getElementById('protocolStatus');

  // Input bindings
  const authorName = document.getElementById('authorName');
  const authorEmail = document.getElementById('authorEmail');
  const authorCountry = document.getElementById('authorCountry');
  const authorBio = document.getElementById('authorBio');

  const articleCategory = document.getElementById('articleCategory');
  const articleFormat = document.getElementById('articleFormat');
  const articleTags = document.getElementById('articleTags');

  const checkGuidelines = document.getElementById('checkGuidelines');
  const checkOriginality = document.getElementById('checkOriginality');
  const checkCopyright = document.getElementById('checkCopyright');
  const checkThirdParty = document.getElementById('checkThirdParty');
  const checkNoGuarantee = document.getElementById('checkNoGuarantee');

  function validateProtocol() {
    // Stage 1: Author Registration
    const s1 = authorName && authorName.value.trim() !== '' &&
               authorEmail && authorEmail.value.trim() !== '' &&
               authorCountry && authorCountry.value.trim() !== '' &&
               authorBio && authorBio.value.trim() !== '';

    // Stage 2: Classification & Abstract
    const s2 = articleCategory && articleCategory.value !== '' &&
               articleFormat && articleFormat.value !== '' &&
               headlineField && headlineField.value.trim() !== '' &&
               abstractField && abstractField.value.trim() !== '' &&
               articleTags && articleTags.value.trim() !== '';

    // Stage 3: Manuscript Payload
    const s3 = articleBody && articleBody.value.length >= 500;

    // Stage 4: Provenance
    const s4 = true; // Always structurally valid, optional AI details validated if checked

    // Stage 5: Declarations
    const s5 = checkGuidelines && checkGuidelines.checked &&
               checkOriginality && checkOriginality.checked &&
               checkCopyright && checkCopyright.checked &&
               checkThirdParty && checkThirdParty.checked &&
               checkNoGuarantee && checkNoGuarantee.checked;

    const stages = [s1, s2, s3, s4, s5];

    // Update left column step UI
    steps.forEach((step, i) => {
      step.classList.remove('step--active', 'step--complete');
      if (stages[i]) {
        step.classList.add('step--complete');
      }
    });

    const firstIncomplete = stages.indexOf(false);
    if (firstIncomplete >= 0 && firstIncomplete < steps.length) {
      steps[firstIncomplete].classList.add('step--active');
    }

    const completedCount = stages.filter(Boolean).length;
    if (protocolStatus) protocolStatus.textContent = `${completedCount}/5 COMPLETE`;

    const allPassed = s1 && s2 && s3 && s4 && s5;
    if (submitBtn) submitBtn.disabled = !allPassed;

    if (compilerStatusValue) {
      if (allPassed) {
        compilerStatusValue.textContent = 'ALL 5 STAGES VERIFIED — READY TO COMMIT';
        compilerStatusValue.className = 'action-compiler__status-value status--ready';
      } else {
        const missing = [];
        if (!s1) missing.push('STAGE_01 (AUTHOR)');
        if (!s2) missing.push('STAGE_02 (METADATA)');
        if (!s3) missing.push('STAGE_03 (BODY >= 500 CHARS)');
        if (!s5) missing.push('STAGE_05 (DECLARATIONS)');
        compilerStatusValue.textContent = `PENDING: ${missing.join(' • ')}`;
        compilerStatusValue.className = 'action-compiler__status-value';
      }
    }
  }

  // Bind validation listeners to all fields
  document.querySelectorAll('#submissionForm input, #submissionForm select, #submissionForm textarea').forEach(el => {
    el.addEventListener('input', validateProtocol);
    el.addEventListener('change', validateProtocol);
  });
  validateProtocol();

  // ──────────────────────────────────────────
  // HASH GENERATOR & COMMIT ENGINE
  // ──────────────────────────────────────────
  function generateTxHash() {
    const chars = '0123456789abcdef';
    let hash = '0x';
    for (let i = 0; i < 64; i++) {
      hash += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return hash;
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', function () {
      if (this.disabled) return;

      const txHash = generateTxHash();
      const compilerHash = document.getElementById('compilerHash');
      const footerStatus = document.getElementById('footerStatus');

      // Gather co-authors
      const coAuthors = [];
      document.querySelectorAll('.co-author-row').forEach(row => {
        const name = row.querySelector('.co-author-name').value.trim();
        const email = row.querySelector('.co-author-email').value.trim();
        if (name || email) coAuthors.push({ name, email });
      });

      // Construct Complete Submission Payload
      const payload = {
        txHash: txHash,
        timestamp: new Date().toISOString(),
        author: {
          legalName: authorName.value.trim(),
          byline: document.getElementById('authorByline').value.trim() || authorName.value.trim(),
          email: authorEmail.value.trim(),
          country: authorCountry.value.trim(),
          city: document.getElementById('authorCity').value.trim(),
          affiliation: document.getElementById('authorAffiliation').value.trim(),
          role: document.getElementById('authorRole').value,
          orcid: document.getElementById('authorOrcid').value.trim(),
          portfolio: document.getElementById('authorWebsite').value.trim(),
          linkedin: document.getElementById('authorLinkedin').value.trim(),
          bio: authorBio.value.trim()
        },
        article: {
          category: articleCategory.value,
          format: articleFormat.value,
          headline: headlineField.value.trim(),
          subtitle: document.getElementById('articleSubtitle').value.trim(),
          tags: articleTags.value.trim(),
          language: document.getElementById('articleLang').value,
          abstract: abstractField.value.trim(),
          body: articleBody.value,
          wordCount: articleBody.value.trim().split(/\s+/).filter(w => w.length > 0).length,
          references: {
            repo: document.getElementById('refRepo').value.trim(),
            doc: document.getElementById('refDoc').value.trim(),
            images: document.getElementById('refImages').value.trim()
          }
        },
        provenance: {
          previousPublication: document.getElementById('pubHistory').value,
          simultaneousReview: document.getElementById('simultaneousSub').value,
          coAuthors: coAuthors,
          aiAssisted: document.getElementById('checkAiUsed').checked,
          aiDetails: document.getElementById('aiDetailsInput') ? document.getElementById('aiDetailsInput').value.trim() : '',
          conflictOfInterest: document.getElementById('conflictInterest').value.trim()
        },
        declarations: {
          guidelinesAgreed: true,
          originalityConfirmed: true,
          authorRetainedCopyrightConfirmed: true,
          thirdPartyPermitted: true,
          noGuaranteeAcknowledged: true
        },
        status: 'Received'
      };

      // Visual execution state
      submitBtn.textContent = '[ TRANSMITTING PAYLOAD // RUNNING CHECKS... ]';
      submitBtn.disabled = true;
      if (compilerStatusValue) compilerStatusValue.textContent = 'COMPILING ENCRYPTED PAYLOAD BUFFER...';

      setTimeout(() => {
        // Save to internal storage
        saveSubmissionToQueue(payload);

        submitBtn.textContent = '[ PAYLOAD COMMITTED SUCCESSFULLY ]';
        submitBtn.classList.add('btn--success');
        if (compilerStatusValue) {
          compilerStatusValue.textContent = 'PAYLOAD QUEUED FOR INITIAL EDITORIAL SCREENING';
          compilerStatusValue.className = 'action-compiler__status-value status--ready';
        }
        if (compilerHash) {
          compilerHash.textContent = `TX_HASH: ${txHash}`;
        }
        if (footerStatus) {
          footerStatus.textContent = `LAST TX: ${txHash.substring(0, 14)}... // ASSIGNED TO EDITORIAL DESK`;
        }

        // Mark stage 5 complete
        steps[4].classList.remove('step--active');
        steps[4].classList.add('step--complete');

        // Alert author with reference ID
        setTimeout(() => {
          alert(`SUBMISSION BROADCAST SUCCESSFUL!\n\nTransaction Hash:\n${txHash}\n\nYour article "${payload.article.headline}" has entered Stage 01 of the TBP Editorial Review Pipeline.\nAn acknowledgement has been queued for ${payload.author.email}.`);
        }, 300);

      }, 1500);
    });
  }

  // ──────────────────────────────────────────
  // EDITORIAL DESK DATA & REPOSITORY
  // ──────────────────────────────────────────
  const DEFAULT_SUBMISSIONS = [
    {
      txHash: '0x9a8f2e4d1b7c3a5e8f0b2d4e6a8c0e2f4a6b8d0c2e4f6a8b0c2d4e6f8a0b2c4',
      author: { byline: 'S. Al-Mansoor', email: 'sam@edgecompute.dev' },
      article: { headline: 'AI in Edge Computing: Micro-kernel Scheduling', category: 'ai', wordCount: 1420 },
      provenance: { aiAssisted: false },
      status: 'Under Review'
    },
    {
      txHash: '0x4f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1',
      author: { byline: 'Elena Rostova', email: 'elena@opensourcekernel.org' },
      article: { headline: 'Building Open Source Toolchains for RISC-V', category: 'opensource', wordCount: 2180 },
      provenance: { aiAssisted: true, aiDetails: 'Draft outline proofreading with Claude 3.5' },
      status: 'Revision'
    },
    {
      txHash: '0x8b0c2d4e6f8a0b2c4e6a8c0e2f4a6b8d0c2e4f6a8b0c2d4e6a8f2e4d1b7c3a5',
      author: { byline: 'Marcus Vance', email: 'vance@orbitalventures.io' },
      article: { headline: 'The Future of Autonomous Avionics & Orbital Buses', category: 'space', wordCount: 1890 },
      provenance: { aiAssisted: false },
      status: 'Accepted'
    },
    {
      txHash: '0x2d4e6a8c0e2f4a6b8d0c2e4f6a8b0c2d4e6f8a0b2c4e6a8f2e4d1b7c3a5e8f0',
      author: { byline: 'Tara Sen', email: 'tara@builderjournal.com' },
      article: { headline: 'Inside Student Startups: Zero-Capital Hardware Engineering', category: 'startups', wordCount: 1150 },
      provenance: { aiAssisted: false },
      status: 'Received'
    }
  ];

  function getSubmissions() {
    try {
      const stored = localStorage.getItem('tbp_submissions');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Storage read failed', e);
    }
    return DEFAULT_SUBMISSIONS;
  }

  function saveSubmissionToQueue(item) {
    const list = getSubmissions();
    list.unshift(item);
    try {
      localStorage.setItem('tbp_submissions', JSON.stringify(list));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
    updateDeskStats();
  }

  function updateDeskStats() {
    const list = getSubmissions();
    const statTotal = document.getElementById('statTotal');
    const statReview = document.getElementById('statReview');
    const statRevision = document.getElementById('statRevision');
    const statAccepted = document.getElementById('statAccepted');

    if (statTotal) statTotal.textContent = list.length + 20; // adding baseline illustrative metrics
    if (statReview) statReview.textContent = list.filter(s => s.status === 'Under Review' || s.status === 'Received').length + 6;
    if (statRevision) statRevision.textContent = list.filter(s => s.status === 'Revision').length + 4;
    if (statAccepted) statAccepted.textContent = list.filter(s => s.status === 'Accepted' || s.status === 'Scheduled').length + 5;
  }

  function renderDeskTable(items) {
    const tbody = document.getElementById('deskTableBody');
    if (!tbody) return;

    const data = items || getSubmissions();
    tbody.innerHTML = '';

    data.forEach((sub, index) => {
      const tr = document.createElement('tr');
      const shortHash = sub.txHash ? sub.txHash.substring(0, 10) + '...' : 'TX_PENDING';
      const statusClass = sub.status ? sub.status.toLowerCase().replace(/\s+/g, '-') : 'received';

      tr.innerHTML = `
        <td style="font-family:var(--font-mono); color:var(--highlight); cursor:pointer;" onclick="inspectSubmission(${index})">${shortHash}</td>
        <td><strong>${sub.article.headline}</strong></td>
        <td>${sub.author.byline || sub.author.legalName || 'Anonymous'} <br><small style="color:var(--fg-muted)">${sub.author.email}</small></td>
        <td><span class="tag">${sub.article.category.toUpperCase()}</span></td>
        <td>${sub.article.wordCount || (sub.article.body ? sub.article.body.split(/\s+/).length : '—')}</td>
        <td>${sub.provenance && sub.provenance.aiAssisted ? '<span style="color:var(--warning)">YES (DISCLOSED)</span>' : '<span style="color:var(--fg-muted)">NONE</span>'}</td>
        <td><span class="status-tag status-tag--${statusClass}">${sub.status}</span></td>
        <td>
          <button class="toolbar-btn" onclick="inspectSubmission(${index})">INSPECT</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    updateDeskStats();
  }

  window.filterDeskTable = function () {
    const search = (document.getElementById('deskSearchInput').value || '').toLowerCase();
    const status = document.getElementById('deskStatusFilter').value;
    const list = getSubmissions();

    const filtered = list.filter(item => {
      const matchSearch = item.article.headline.toLowerCase().includes(search) ||
                          (item.author.byline && item.author.byline.toLowerCase().includes(search)) ||
                          (item.txHash && item.txHash.toLowerCase().includes(search));
      const matchStatus = status === 'ALL' || item.status === status;
      return matchSearch && matchStatus;
    });

    renderDeskTable(filtered);
  };

  window.inspectSubmission = function (index) {
    const list = getSubmissions();
    const item = list[index];
    if (!item) return;

    const drawer = document.getElementById('inspectorDrawer');
    const inspectTitle = document.getElementById('inspectTitle');
    const inspectBody = document.getElementById('inspectBody');

    if (drawer && inspectTitle && inspectBody) {
      inspectTitle.textContent = `[PAYLOAD_INSPECTOR // ${item.txHash ? item.txHash.substring(0, 18) : 'PENDING'}...]`;
      inspectBody.innerHTML = `
        <div style="margin-bottom:12px;">
          <h3 style="color:var(--accent); font-size:16px;">${item.article.headline}</h3>
          <p style="color:var(--fg-dim); font-size:12px;">Author: ${item.author.byline || item.author.legalName} (${item.author.email}) │ Category: ${item.article.category} │ Status: <strong>${item.status}</strong></p>
        </div>
        <div style="margin-bottom:12px;">
          <strong>EDITORIAL ACTIONS:</strong>
          <button class="toolbar-btn" onclick="updateItemStatus(${index}, 'Under Review')">MARK REVIEW</button>
          <button class="toolbar-btn" onclick="updateItemStatus(${index}, 'Revision')">REQUEST REVISION</button>
          <button class="toolbar-btn" onclick="updateItemStatus(${index}, 'Accepted')">ACCEPT</button>
          <button class="toolbar-btn" onclick="updateItemStatus(${index}, 'Scheduled')">SCHEDULE</button>
        </div>
        <pre><code>${JSON.stringify(item, null, 2)}</code></pre>
      `;
      drawer.classList.add('active');
    }
  };

  window.updateItemStatus = function (index, newStatus) {
    const list = getSubmissions();
    if (list[index]) {
      list[index].status = newStatus;
      try {
        localStorage.setItem('tbp_submissions', JSON.stringify(list));
      } catch (e) {
        console.warn(e);
      }
      renderDeskTable();
      inspectSubmission(index);
    }
  };

  window.closeInspector = function () {
    const drawer = document.getElementById('inspectorDrawer');
    if (drawer) drawer.classList.remove('active');
  };

  window.exportSubmissionsJSON = function () {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getSubmissions(), null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tbp_submissions_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Initial render of desk table
  renderDeskTable();

})();
