  var registeredUsers = {
    "citizen123": { password: "password", name: "Rahul Sharma", role: "citizen" },
    "officer123": { password: "password", name: "Rajesh Kumar", role: "officer" },
    "court123": { password: "password", name: "Hon. District Judge", role: "court" },
    "admin123": { password: "password", name: "Arvind Kumar IPS", role: "admin" }
  };
  var currentRole = 'admin';
  var isLoggedIn = false;
  var roleData = {
    citizen: { name: 'Rahul Sharma', initials: 'RS', role: 'Citizen' },
    officer: { name: 'Rajesh Kumar', initials: 'RK', role: 'Inspector · East District' },
    court: { name: 'Hon. District Judge', initials: 'DJ', role: 'District Court' },
    admin: { name: 'Arvind Kumar IPS', initials: 'AK', role: 'Superintendent of Police' }
  };

  var firData = [
    {
      id: "#2024-0001",
      complainant: "Rahul Sharma",
      mobile: "+91 98765 43210",
      aadhaar: "XXXX-XXXX-3421",
      email: "rahul@gmail.com",
      address: "12, Gandhi Nagar, Patna",
      type: "Theft",
      status: "Under Investigation",
      dateStr: "15 Mar 2024",
      datetime: "2024-03-15T09:00",
      location: "Kankarbagh Market, Patna",
      description: "My mobile phone (iPhone 14, Black) and cash of ₹15,000 was stolen at Kankarbagh market while I was shopping. Two individuals on a motorcycle snatched my bag and fled towards Boring Road. I could identify one of them as wearing a red jacket. CCTV footage may be available from nearby shops.",
      policeStation: "East District Police Station",
      officer: "Rajesh Kumar",
      badge: "badge-gold",
      priority: "Medium"
    },
    {
      id: "#2024-0002",
      complainant: "Rahul Sharma",
      mobile: "+91 98765 43210",
      aadhaar: "XXXX-XXXX-3421",
      email: "rahul@gmail.com",
      address: "12, Gandhi Nagar, Patna",
      type: "Cybercrime",
      status: "Filed",
      dateStr: "20 Mar 2024",
      datetime: "2024-03-20T11:30",
      location: "Online",
      description: "Received a phishing link on WhatsApp and lost money.",
      policeStation: "East District Police Station",
      officer: "Unassigned",
      badge: "badge-gray",
      priority: "High"
    },
    {
      id: "#2024-0003",
      complainant: "Rahul Sharma",
      mobile: "+91 98765 43210",
      aadhaar: "XXXX-XXXX-3421",
      email: "rahul@gmail.com",
      address: "12, Gandhi Nagar, Patna",
      type: "Assault",
      status: "Resolved",
      dateStr: "10 Mar 2024",
      datetime: "2024-03-10T18:45",
      location: "Boring Road, Patna",
      description: "Physical altercation in public.",
      policeStation: "East District Police Station",
      officer: "Rajesh Kumar",
      badge: "badge-green",
      priority: "Low"
    }
  ];

  var notificationsData = [{
    text: "Your FIR #2024-0001 status updated to <strong>Under Investigation</strong>. Officer Rajesh Kumar has been assigned.",
    time: "Just now"
  }];

  function generateFirId() {
    return "#2024-" + (1000 + firData.length).toString().padStart(4, '0');
  }

  var currentCaptcha = '';

  function initCaptcha() {
    var canvas = document.getElementById('captcha-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var code = '';
    for (var i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    currentCaptcha = code;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f2f4f7';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines for noise
    for (var n = 0; n < 5; n++) {
      ctx.strokeStyle = 'rgba(' + Math.floor(Math.random() * 120) + ',' + Math.floor(Math.random() * 120) + ',' + Math.floor(Math.random() * 120) + ', 0.25)';
      ctx.lineWidth = 1 + Math.random();
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    ctx.font = 'bold 20px "Outfit", "Courier New", sans-serif';
    ctx.textBaseline = 'middle';

    for (var t = 0; t < code.length; t++) {
      var char = code.charAt(t);
      var x = 15 + t * 22 + Math.random() * 3;
      var y = canvas.height / 2 + (Math.random() * 8 - 4);
      var angle = (Math.random() * 24 - 12) * Math.PI / 180;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = 'rgb(' + Math.floor(Math.random() * 80) + ',' + Math.floor(Math.random() * 80) + ',' + Math.floor(Math.random() * 120) + ')';
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }

    // Add some noise dots
    for (var d = 0; d < 25; d++) {
      ctx.fillStyle = 'rgba(' + Math.floor(Math.random() * 150) + ',' + Math.floor(Math.random() * 150) + ',' + Math.floor(Math.random() * 150) + ', 0.4)';
      ctx.beginPath();
      ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 0.8 + Math.random() * 0.8, 0, Math.PI * 2);
      ctx.fill();
    }

    var captchaInp = document.getElementById('login-captcha');
    if (captchaInp) {
      captchaInp.value = currentCaptcha;
    }
  }

  function togglePasswordView() {
    var passInp = document.getElementById('login-pass');
    var eyeSpan = document.getElementById('password-toggle-eye');
    if (!passInp || !eyeSpan) return;
    if (passInp.type === 'password') {
      passInp.type = 'text';
      eyeSpan.textContent = '🙈';
    } else {
      passInp.type = 'password';
      eyeSpan.textContent = '👁';
    }
  }

  function maskName(name) {
    if (!name) return 'N/A';
    var parts = name.split(' ');
    var maskedParts = parts.map(function(part) {
      if (part.length <= 2) {
        return part.charAt(0) + '*'.repeat(part.length - 1);
      }
      return part.charAt(0) + '*'.repeat(part.length - 2) + part.charAt(part.length - 1);
    });
    return maskedParts.join(' ');
  }

  function getTimelineHtml(status, dateStr, officer, policeStation) {
    var steps = [
      { title: "FIR Filed", date: dateStr, note: "FIR accepted at " + (policeStation || "Local District Police Station"), key: "Filed" },
      { title: "Assigned to Officer", date: dateStr, note: "Assigned to " + (officer !== "Unassigned" ? officer : "Investigating Officer"), key: "Assigned" },
      { title: "Under Investigation", date: "Active", note: "Evidence collection and investigation in progress.", key: "Under Investigation" },
      { title: "In Court", date: "Pending hearing", note: "Chargesheet prepared and submitted to court.", key: "In Court" },
      { title: "Case Closed", date: "Resolved", note: "Final report approved and case closed.", key: "Resolved" }
    ];

    var activeIndex = 0;
    if (status === "Filed") {
      activeIndex = 0;
    } else if (status === "Under Investigation") {
      activeIndex = 2;
    } else if (status === "In Court") {
      activeIndex = 3;
    } else if (status === "Resolved" || status.includes("Close")) {
      activeIndex = 4;
    } else {
      activeIndex = 1;
    }

    var html = '<div class="timeline">';
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i];
      var dotClass = 'pending';
      var lineStyle = '';
      
      if (i < activeIndex) {
        dotClass = 'done';
      } else if (i === activeIndex) {
        dotClass = 'active';
      }

      if (i < activeIndex) {
        lineStyle = 'background: var(--green);';
      } else if (i === activeIndex && i < steps.length - 1) {
        lineStyle = 'background: var(--gray-mid);';
      } else {
        lineStyle = 'background: var(--gray-mid);';
      }

      var showLine = i < steps.length - 1;
      
      html += '<div class="tl-step">' +
              '  <div class="tl-col">' +
              '    <div class="tl-dot ' + dotClass + '"></div>' +
              (showLine ? '    <div class="tl-line" style="' + lineStyle + '"></div>' : '') +
              '  </div>' +
              '  <div class="tl-body">' +
              '    <div class="tl-title">' + step.title + '</div>' +
              '    <div class="tl-date">' + (i <= activeIndex ? step.date : 'Pending') + '</div>' +
              (i <= activeIndex ? '    <div class="tl-note">' + step.note + '</div>' : '') +
              '  </div>' +
              '</div>';
    }
    html += '</div>';
    return html;
  }

  function trackFIR() {
    var firInput = document.getElementById('quick-track-input');
    if (!firInput) return;
    var query = firInput.value.trim();
    if (!query) {
      alert("Please enter a valid FIR Number.");
      return;
    }

    var found = firData.find(function(f) {
      return f.id.toLowerCase() === query.toLowerCase();
    });

    var modal = document.getElementById('quick-track-modal');
    var modalBody = document.getElementById('track-modal-body');
    if (!modal || !modalBody) return;

    if (found) {
      var maskedComplainant = maskName(found.complainant);
      var detailsHtml = 
        '<div class="modal-detail-card">' +
        '  <div class="modal-detail-title">FIR Details - ' + found.id + '</div>' +
        '  <div style="font-size: 12px; line-height: 1.6; color: var(--text);">' +
        '    <strong>Complainant:</strong> ' + maskedComplainant + '<br>' +
        '    <strong>Type of Offense:</strong> ' + found.type + '<br>' +
        '    <strong>Incident Date:</strong> ' + found.dateStr + '<br>' +
        '    <strong>Police Jurisdiction:</strong> ' + (found.policeStation || 'East District Police Station') + '<br>' +
        '    <strong>Current Status:</strong> <span class="badge ' + found.badge + '">' + found.status + '</span>' +
        '  </div>' +
        '</div>' +
        '<div style="margin-top: 15px;">' +
        '  <div style="font-size: 13px; font-weight: 600; color: var(--navy); margin-bottom: 10px;">Investigation Timeline</div>' +
        getTimelineHtml(found.status, found.dateStr, found.officer, found.policeStation) +
        '</div>';

      modalBody.innerHTML = detailsHtml;
      modal.style.display = 'flex';
    } else {
      alert("No record found for FIR Number: " + query + ". Please check the format and try again.");
    }
  }

  function closeTrackModal() {
    var modal = document.getElementById('quick-track-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  function selectRole(r) {
    currentRole = r;
    ['citizen','officer','court','admin'].forEach(function(x) {
      var el = document.getElementById('r-'+x);
      if(el) el.classList.toggle('selected', x === r);
    });
    var userInp = document.getElementById('login-user');
    var passInp = document.getElementById('login-pass');
    if (userInp && passInp) {
        userInp.value = r + '123';
        passInp.value = 'password';
    }
    if (!currentCaptcha) {
      initCaptcha();
    } else {
      var captchaInp = document.getElementById('login-captcha');
      if (captchaInp) {
        captchaInp.value = currentCaptcha;
      }
    }
  }

  function setupUserUI(u, r) {
    currentRole = r;
    document.body.className = 'role-' + r;
    roleData[r].name = registeredUsers[u].name;

    var d = roleData[r];
    document.getElementById('top-name').textContent = d.name;
    var nameParts = d.name.split(' ');
    var initials = nameParts[0].charAt(0).toUpperCase() + (nameParts.length > 1 ? nameParts[1].charAt(0).toUpperCase() : '');
    document.getElementById('top-avatar').textContent = initials;
    document.getElementById('user-badge').style.display = 'flex';
    document.getElementById('nav-tabs').style.display = 'flex';

    // Show top-bar on login
    var topBar = document.getElementById('top-bar-main');
    if (topBar) topBar.style.display = 'block';

    var logoPortalSub = document.getElementById('logo-portal-sub');
    if (logoPortalSub) {
      if (r === 'citizen') {
        logoPortalSub.textContent = 'Citizen Portal';
      } else if (r === 'officer') {
        logoPortalSub.textContent = 'Officer Portal';
      } else if (r === 'court') {
        logoPortalSub.textContent = 'Court Portal';
      } else if (r === 'admin') {
        logoPortalSub.textContent = 'Admin Portal';
      }
    }

    document.getElementById('tab-file-fir').style.display = r === 'citizen' ? 'block' : 'none';
    document.getElementById('tab-officers').style.display = r === 'admin' ? 'block' : 'none';
    document.getElementById('tab-analytics').style.display = (r === 'officer' || r === 'admin') ? 'block' : 'none';
    document.getElementById('tab-fir-list').style.display = (r === 'court' || r === 'admin') ? 'none' : 'block';

    document.getElementById('btn-file-fir-top').style.display = r === 'citizen' ? 'inline-block' : 'none';
    document.getElementById('officer-action-card').style.display = r === 'citizen' ? 'none' : 'block';

    document.getElementById('screen-login').style.display = 'none';
    var launcher = document.getElementById('ai-chat-launcher');
    if (launcher) {
      launcher.style.display = (r === 'citizen') ? 'block' : 'none';
    }

    var dId = document.getElementById('dash-citizen');
    var oId = document.getElementById('dash-officer');
    var aId = document.getElementById('dash-admin');
    var cId = document.getElementById('dash-court');
    dId.style.display = 'none'; oId.style.display = 'none'; aId.style.display = 'none';
    if (cId) cId.style.display = 'none';

    if (r === 'citizen') dId.style.display = 'block';
    else if (r === 'officer') oId.style.display = 'block';
    else if (r === 'court' && cId) cId.style.display = 'block';
    else aId.style.display = 'block';

    renderApp();
  }

  function doLogin() {
    var u = document.getElementById('login-user').value;
    var p = document.getElementById('login-pass').value;
    var cap = document.getElementById('login-captcha').value;

    if (cap.toLowerCase() !== currentCaptcha.toLowerCase()) {
      alert("Invalid captcha code. Please check and try again.");
      initCaptcha();
      return;
    }

    if (!registeredUsers[u] || registeredUsers[u].password !== p || registeredUsers[u].role !== currentRole) {
      alert("Invalid login credentials for the selected role. Please check your mobile/username, password, and chosen role.");
      initCaptcha();
      return;
    }
    
    isLoggedIn = true;
    sessionStorage.setItem('isLoggedIn', 'true');
    sessionStorage.setItem('currentUser', u);
    sessionStorage.setItem('currentRole', currentRole);

    setupUserUI(u, currentRole);

    window.location.hash = 'dashboard';
  }

  function logout() {
    window.location.hash = 'login';
  }

  function logoutInternal() {
    isLoggedIn = false;
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentRole');

    document.body.className = '';
    document.getElementById('user-badge').style.display = 'none';
    document.getElementById('nav-tabs').style.display = 'none';

    // Hide top-bar on logout
    var topBar = document.getElementById('top-bar-main');
    if (topBar) topBar.style.display = 'none';

    document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); s.style.display = ''; });
    document.getElementById('screen-login').style.display = 'block';
    document.getElementById('screen-login').classList.add('active');
    var launcher = document.getElementById('ai-chat-launcher');
    if (launcher) launcher.style.display = 'block';
    currentRole = 'admin';

    // Regenerate captcha on logout
    initCaptcha();

    ['citizen','officer','court','admin'].forEach(function(x) { document.getElementById('r-'+x).classList.remove('selected'); });
    document.getElementById('fir-success').style.display = 'none';
  }

  function showScreen(name, tabEl) {
    window.location.hash = name;
  }

  function showScreenInternal(name, tabEl) {
    if (isLoggedIn) {
      var topBar = document.getElementById('top-bar-main');
      if (topBar) topBar.style.display = 'block';
      var navTabs = document.getElementById('nav-tabs');
      if (navTabs) navTabs.style.display = 'flex';
      
      var launcher = document.getElementById('ai-chat-launcher');
      if (launcher) {
        launcher.style.display = (currentRole === 'citizen') ? 'block' : 'none';
      }
    }

    document.querySelectorAll('.screen').forEach(function(s) {
      s.classList.remove('active');
      s.style.display = '';
    });

    var el = document.getElementById('screen-'+name);
    if (el) el.classList.add('active');
    if (tabEl) {
      document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
      tabEl.classList.add('active');
    } else {
      var autoTab = findTabElement(name);
      if (autoTab) {
        document.querySelectorAll('.nav-tab').forEach(function(t) { t.classList.remove('active'); });
        autoTab.classList.add('active');
      }
    }
  }

  function showLoginInternal() {
    document.querySelectorAll('.screen').forEach(function(s) { s.classList.remove('active'); s.style.display = ''; });
    document.getElementById('screen-login').style.display = 'block';
    document.getElementById('screen-login').classList.add('active');
    var launcher = document.getElementById('ai-chat-launcher');
    if (launcher) launcher.style.display = 'block';
  }

  function switchTab(ns, tab, el) {
    var prefix = ns + '-';
    document.querySelectorAll('[id^="'+prefix+'"]').forEach(function(x) { x.style.display = 'none'; });
    var t = document.getElementById(ns+'-'+tab);
    if (t) t.style.display = 'block';
    if (el) {
      var parent = el.parentElement;
      parent.querySelectorAll('.inner-tab').forEach(function(x) { x.classList.remove('active'); });
      el.classList.add('active');
    }
  }

  function showFirSuccess() {
    var nameEl = document.getElementById('fir-input-name');
    var mobileEl = document.getElementById('fir-input-mobile');
    var aadhaarEl = document.getElementById('fir-input-aadhaar');
    var emailEl = document.getElementById('fir-input-email');
    var addressEl = document.getElementById('fir-input-address');
    
    var typeEl = document.getElementById('fir-input-type');
    var datetimeEl = document.getElementById('fir-input-datetime');
    var locationEl = document.getElementById('fir-input-location');
    var descEl = document.getElementById('fir-input-desc');
    var psEl = document.getElementById('fir-input-ps');

    var ps = psEl ? psEl.value.trim() : '';
    if (!ps) {
      alert("Please select a Police Station.");
      if (psEl) psEl.focus();
      return;
    }

    var nam = nameEl && nameEl.value.trim() ? nameEl.value.trim() : 'Citizen';
    var mob = mobileEl && mobileEl.value.trim() ? mobileEl.value.trim() : 'N/A';
    var aadhaar = aadhaarEl && aadhaarEl.value.trim() ? aadhaarEl.value.trim() : 'XXXX-XXXX-XXXX';
    var email = emailEl && emailEl.value.trim() ? emailEl.value.trim() : '';
    var address = addressEl && addressEl.value.trim() ? addressEl.value.trim() : 'N/A';
    
    var typ = typeEl ? typeEl.value : 'Other';
    var datetime = datetimeEl ? datetimeEl.value : '';
    var loc = locationEl && locationEl.value.trim() ? locationEl.value.trim() : 'N/A';
    var desc = descEl && descEl.value.trim() ? descEl.value.trim() : 'No description provided.';
    var priorityEl = document.getElementById('fir-input-priority');
    var pri = priorityEl ? priorityEl.value : 'Medium';

    var newId = generateFirId();
    var d = new Date();
    var dateStr = d.getDate() + ' ' + d.toLocaleString('default', { month: 'short' }) + ' ' + d.getFullYear();

    var obj = {
      id: newId,
      complainant: nam,
      mobile: mob,
      aadhaar: aadhaar,
      email: email,
      address: address,
      type: typ,
      datetime: datetime,
      location: loc,
      description: desc,
      policeStation: ps,
      status: "Filed",
      dateStr: dateStr,
      officer: "Unassigned",
      badge: "badge-gray",
      priority: pri
    };

    firData.push(obj);
    notificationsData.push({ text: "Your FIR "+newId+" has been filed successfully.", time: "Just now" });
    
    var succId = document.getElementById('success-fir-id');
    if (succId) succId.innerText = newId;

    document.getElementById('fir-success').style.display = 'block';
    document.getElementById('fir-success').scrollIntoView({ behavior: 'smooth' });
    
    // Clear inputs
    if (nameEl) nameEl.value = '';
    if (mobileEl) mobileEl.value = '';
    if (aadhaarEl) aadhaarEl.value = '';
    if (emailEl) emailEl.value = '';
    if (addressEl) addressEl.value = '';
    if (typeEl) typeEl.selectedIndex = 0;
    if (datetimeEl) datetimeEl.value = '';
    if (locationEl) locationEl.value = '';
    if (descEl) descEl.value = '';
    if (psEl) psEl.value = '';
    if (priorityEl) priorityEl.value = 'Medium';

    renderApp();
  }

  function renderApp() {
    renderDashboardStats();
    renderRecentFirs();
    renderFirList();
    renderNotifications();
  }

  function renderDashboardStats() {
    var statTot = document.getElementById('dash-tot-firs');
    var statInv = document.getElementById('dash-inv-firs');
    var statRes = document.getElementById('dash-res-firs');
    var statPen = document.getElementById('dash-pen-firs');
    if(!statTot) return;

    var currentUserStr = (currentRole === 'citizen') ? document.getElementById('top-name').textContent : null;
    var myFirs = currentRole === 'citizen' ? firData.filter(function(f) { return f.complainant === currentUserStr && f.priority !== 'High'; }) : firData;

    var inv = myFirs.filter(function(f) { return f.status.includes('Investigation'); }).length;
    var res = myFirs.filter(function(f) { return f.status === 'Resolved' || f.status.includes('Close'); }).length;
    var pen = myFirs.filter(function(f) { return f.status === 'Filed' || f.status.includes('Pending') || f.status === 'Unassigned'; }).length;

    statTot.textContent = myFirs.length;
    if(statInv) statInv.textContent = inv;
    if(statRes) statRes.textContent = res;
    if(statPen) statPen.textContent = pen;
  }

  function renderRecentFirs() {
    var container = document.getElementById('dash-recent-firs');
    if(!container) return;
    
    var currentUserStr = (currentRole === 'citizen') ? document.getElementById('top-name').textContent : null;
    var myFirs = currentRole === 'citizen' ? firData.filter(function(f) { return f.complainant === currentUserStr && f.priority !== 'High'; }) : firData;

    container.innerHTML = '';
    if (myFirs.length === 0) {
      container.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:10px;">No recent FIRs</div>';
      return;
    }
    
    var lat = myFirs.slice(Math.max(myFirs.length - 4, 0)).reverse();
    var html = '';
    lat.forEach(function(f) {
      html += '<div class="fir-detail-row"><span class="fir-detail-key">FIR '+f.id+'</span><span class="badge '+f.badge+'">'+f.status+'</span></div>';
    });
    container.innerHTML = html;
  }

  function renderFirList() {
    var tbody = document.getElementById('fir-table-body');
    if(!tbody) return;

    var currentUserStr = (currentRole === 'citizen') ? document.getElementById('top-name').textContent : null;
    var myFirs = currentRole === 'citizen' ? firData.filter(function(f) { return f.complainant === currentUserStr && f.priority !== 'High'; }) : firData;
    
    var html = '';
    var displayFirs = [].concat(myFirs).reverse();
    displayFirs.forEach(function(f) {
      html += '<tr>' +
              '<td style="font-weight:500;color:var(--navy);">'+f.id+'</td>' +
              '<td>'+f.complainant+'</td>' +
              '<td>'+f.type+'</td>' +
              '<td>'+f.dateStr+'</td>' +
              '<td>'+f.officer+'</td>' +
              '<td><span class="badge '+f.badge+'">'+f.status+'</span></td>' +
              '<td><button class="btn btn-secondary btn-sm" onclick="viewFirDetail(\''+f.id+'\')">View</button></td>' +
              '</tr>';
    });
    tbody.innerHTML = html;
  }

  function viewFirDetail(id) {
    window.location.hash = 'fir-detail/' + encodeURIComponent(id);
  }

  function renderFirDetail(id) {
    var found = firData.find(function(f) { return f.id === id; });
    if (!found) return false;

    if (currentRole === 'citizen' && found.priority === 'High') {
      alert("Access Denied: High priority cases are restricted on the citizen dashboard.");
      window.location.hash = 'dashboard';
      return false;
    }

    // Update screen-fir-detail title and subtitle
    var titleEl = document.getElementById('detail-title');
    if (titleEl) titleEl.textContent = 'FIR ' + found.id + ' · ' + found.type;

    var subEl = document.getElementById('detail-sub');
    if (subEl) {
      subEl.textContent = 'Filed: ' + found.dateStr + ' · ' + (found.policeStation || 'East District Police Station');
    }

    var statusEl = document.getElementById('detail-status');
    if (statusEl) {
      statusEl.textContent = found.status;
      statusEl.className = 'badge ' + found.badge;
    }

    // Complainant Details
    var compNameEl = document.getElementById('detail-comp-name');
    if (compNameEl) compNameEl.textContent = found.complainant || 'N/A';

    var compMobileEl = document.getElementById('detail-comp-mobile');
    if (compMobileEl) compMobileEl.textContent = found.mobile || 'N/A';

    var compAadhaarEl = document.getElementById('detail-comp-aadhaar');
    if (compAadhaarEl) compAadhaarEl.textContent = found.aadhaar || 'XXXX-XXXX-3421';

    var compAddressEl = document.getElementById('detail-comp-address');
    if (compAddressEl) compAddressEl.textContent = found.address || 'N/A';

    // Incident Details
    var incTypeEl = document.getElementById('detail-inc-type');
    if (incTypeEl) incTypeEl.textContent = found.type;

    var incLocEl = document.getElementById('detail-inc-loc');
    if (incLocEl) incLocEl.textContent = found.location || 'N/A';

    var incDateEl = document.getElementById('detail-inc-date');
    if (incDateEl) {
      if (found.datetime) {
        if (found.datetime.includes('T')) {
          var dt = new Date(found.datetime);
          incDateEl.textContent = dt.toLocaleString('default', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
        } else {
          incDateEl.textContent = found.datetime;
        }
      } else {
        incDateEl.textContent = found.dateStr;
      }
    }

    var incDescEl = document.getElementById('detail-inc-desc');
    if (incDescEl) incDescEl.textContent = found.description || 'No description provided.';

    var incPriorityEl = document.getElementById('detail-inc-priority');
    if (incPriorityEl) {
      incPriorityEl.textContent = found.priority || 'Medium';
    }
    return true;
  }

  function renderNotifications() {
    var container = document.getElementById('notifications-list');
    if(!container) return;

    container.innerHTML = '';
    if (notificationsData.length === 0) {
      container.innerHTML = '<div style="font-size:12px;color:var(--text-muted);text-align:center;padding:20px;">No new notifications</div>';
      return;
    }

    var html = '';
    var lat = [].concat(notificationsData);
    lat.forEach(function(n) {
      html += '<div class="notif"><div class="notif-icon">⚠</div><div><div class="notif-text">'+n.text+'</div><div class="notif-time">'+n.time+'</div></div></div>';
    });
    container.innerHTML = html;
  }

  var currentCourtFir = null;

  function searchCourtFir() {
    var query = document.getElementById('court-search-fir').value.trim();
    var detailBox = document.getElementById('court-fir-details');
    if(!query) {
      alert("Please enter FIR No.");
      return;
    }
    
    var found = firData.find(function(f) { return f.id === query; });
    if(found) {
      currentCourtFir = found;
      detailBox.style.display = 'block';
      detailBox.innerHTML = 
        '<strong>Complainant:</strong> ' + found.complainant + '<br>' +
        '<strong>Type:</strong> ' + found.type + '<br>' +
        '<strong>Date:</strong> ' + found.dateStr + '<br>' +
        '<strong>Current Status:</strong> ' + found.status + '<br>' + 
        '<strong>Officer:</strong> ' + found.officer;
    } else {
      currentCourtFir = null;
      detailBox.style.display = 'block';
      detailBox.innerHTML = '<span style="color:var(--red);">FIR ' + query + ' not found in database.</span>';
    }
  }

  function submitCourtUpdate() {
    if (!currentCourtFir) {
      alert("Please search and select a valid FIR first.");
      return;
    }
    
    var date = document.getElementById('court-update-date').value;
    var purpose = document.getElementById('court-update-purpose').value;
    var notes = document.getElementById('court-update-notes').value;

    if (!date) {
      alert("Please select a hearing date.");
      return;
    }

    currentCourtFir.status = "In Court";
    currentCourtFir.badge = "badge-blue";

    var dObj = new Date(date);
    var formattedDate = dObj.getDate() + ' ' + dObj.toLocaleString('default', { month: 'short' }) + ' ' + dObj.getFullYear();

    var notifText = "Court hearing scheduled for FIR " + currentCourtFir.id + ". Date: <strong>" + formattedDate + "</strong> for " + purpose + ". " + (notes ? "Notes: " + notes : "");
    notificationsData.push({ text: notifText, time: "Just now" });

    alert("FIR " + currentCourtFir.id + " updated successfully!");

    // Clear inputs
    document.getElementById('court-search-fir').value = '';
    document.getElementById('court-fir-details').style.display = 'none';
    document.getElementById('court-update-date').value = '';
    document.getElementById('court-update-notes').value = '';
    
    currentCourtFir = null;
    renderApp();
  }

  function toggleRegister(view) {
    if (view === 'register') {
      document.getElementById('login-body-main').style.display = 'none';
      document.getElementById('register-body-main').style.display = 'block';
      document.getElementById('reg-step-1').style.display = 'block';
      document.getElementById('reg-step-2').style.display = 'none';
      document.getElementById('reg-step-3').style.display = 'none';
      document.getElementById('reg-login-link').style.display = 'block';
      document.getElementById('reg-phone').value = '';
      document.getElementById('reg-name').value = '';
      document.getElementById('reg-pass').value = '';
      document.getElementById('reg-otp').value = '';
    } else {
      document.getElementById('login-body-main').style.display = 'block';
      document.getElementById('register-body-main').style.display = 'none';
    }
  }

  function sendOTP() {
    var phone = document.getElementById('reg-phone').value;
    var name = document.getElementById('reg-name').value;
    var pass = document.getElementById('reg-pass').value;
    if (!name || phone.length < 10 || !pass) {
      alert("Please enter valid name, phone number, and password");
      return;
    }
    document.getElementById('reg-step-1').style.display = 'none';
    document.getElementById('reg-step-2').style.display = 'block';
    document.getElementById('otp-phone-display').innerText = phone;
  }

  function verifyOTP() {
    var otp = document.getElementById('reg-otp').value;
    var phone = document.getElementById('reg-phone').value;
    var name = document.getElementById('reg-name').value;
    var pass = document.getElementById('reg-pass').value;
    var role = document.getElementById('reg-role').value;

    if (otp.length < 4) {
      alert("Please enter valid OTP");
      return;
    }

    registeredUsers[phone] = { password: pass, name: name, role: role };

    document.getElementById('reg-step-2').style.display = 'none';
    document.getElementById('reg-step-3').style.display = 'block';
    document.getElementById('reg-login-link').style.display = 'none';
    
    document.getElementById('login-user').value = phone;
    document.getElementById('login-pass').value = pass;
    selectRole(role);
  }

  selectRole('admin');

  // ================= NyayaMitra AI Chat Assistant Functions =================

  function openAIChat() {
    window.location.hash = 'ai-chat';
  }

  function openAIChatInternal() {
    var topBar = document.getElementById('top-bar-main');
    if (topBar) topBar.style.display = 'none';
    var navTabs = document.getElementById('nav-tabs');
    if (navTabs) navTabs.style.display = 'none';

    document.querySelectorAll('.screen').forEach(function(s) {
      s.classList.remove('active');
      s.style.display = 'none';
    });

    var screenAIChat = document.getElementById('screen-ai-chat');
    var launcher = document.getElementById('ai-chat-launcher');
    
    if (screenAIChat) {
      screenAIChat.classList.add('active');
      screenAIChat.style.display = 'block';
    }
    if (launcher) {
      launcher.style.display = 'none';
    }
    
    // Scroll messages to bottom on open
    var messagesContainer = document.getElementById('ai-chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  function closeAIChat() {
    window.location.hash = isLoggedIn ? 'dashboard' : 'login';
  }

  function closeAIChatInternal() {
    var screenAIChat = document.getElementById('screen-ai-chat');
    var launcher = document.getElementById('ai-chat-launcher');
    
    if (screenAIChat) {
      screenAIChat.classList.remove('active');
      screenAIChat.style.display = 'none';
    }
    
    if (isLoggedIn) {
      var topBar = document.getElementById('top-bar-main');
      if (topBar) topBar.style.display = 'block';
      var navTabs = document.getElementById('nav-tabs');
      if (navTabs) navTabs.style.display = 'flex';
      
      var dashboardScreen = document.getElementById('screen-dashboard');
      if (dashboardScreen) {
        dashboardScreen.classList.add('active');
        dashboardScreen.style.display = 'block';
      }
      if (launcher) {
        launcher.style.display = (currentRole === 'citizen') ? 'block' : 'none';
      }
    } else {
      var screenLogin = document.getElementById('screen-login');
      if (screenLogin) {
        screenLogin.classList.add('active');
        screenLogin.style.display = 'block';
      }
      if (launcher) {
        launcher.style.display = 'block';
      }
    }
    
    // Close plus menu if open
    var popup = document.getElementById('ai-attachments-popup');
    if (popup) {
      popup.style.display = 'none';
    }
  }

  function toggleAIPlusMenu() {
    var popup = document.getElementById('ai-attachments-popup');
    if (!popup) return;
    if (popup.style.display === 'none' || popup.style.display === '') {
      popup.style.display = 'flex';
    } else {
      popup.style.display = 'none';
    }
  }

  function handleAIAttachment(type) {
    var popup = document.getElementById('ai-attachments-popup');
    if (popup) popup.style.display = 'none';
    
    var messagesContainer = document.getElementById('ai-chat-messages');
    if (!messagesContainer) return;
    
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var timeStr = hours + ':' + minutes + ' ' + ampm;
    
    var attachmentText = '';
    var botConfirmText = '';
    
    if (type === 'Camera') {
      attachmentText = '📸 Photo captured: incident_snapshot_temp.png';
      botConfirmText = 'I\'ve received the captured image. I will include this visual evidence in your mock complaint draft. What details should we add next?';
    } else if (type === 'Image') {
      attachmentText = '🖼 Image attached: evidence_image.jpg';
      botConfirmText = 'Evidence image attached successfully. I have analyzed the metadata and queued it for the portal upload. Please provide details of the complaint.';
    } else if (type === 'Media') {
      attachmentText = '📁 Document uploaded: incident_report.pdf';
      botConfirmText = 'Legal document/media file uploaded. I will reference this attachment in your case details. What else can you tell me about the incident?';
    } else if (type === 'Location') {
      attachmentText = '📍 Location shared: Lat 25.5941, Lon 85.1376 (Patna, Bihar)';
      botConfirmText = 'Location details shared successfully. This will map the case jurisdiction to the East District Police Station. Please describe the incident.';
    }
    
    // Add user attachment message bubble
    var userMsgHtml = 
      '<div class="ai-msg ai-msg-user">' +
      '  <div class="ai-msg-avatar">👤</div>' +
      '  <div class="ai-msg-bubble">' +
      '    <div class="ai-msg-sender">You</div>' +
      '    <div class="ai-msg-text">' +
      '      <div class="ai-attach-bubble">' +
      '        <span class="ai-attach-icon">📎</span>' +
      '        <span>' + attachmentText + '</span>' +
      '      </div>' +
      '    </div>' +
      '    <div class="ai-msg-time">' + timeStr + '</div>' +
      '  </div>' +
      '</div>';
      
    messagesContainer.insertAdjacentHTML('beforeend', userMsgHtml);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Show typing indicator
    var typingIndicator = document.getElementById('ai-typing-indicator');
    if (typingIndicator) {
      typingIndicator.style.display = 'flex';
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Delay and respond
    setTimeout(function() {
      if (typingIndicator) typingIndicator.style.display = 'none';
      
      var botMsgHtml = 
        '<div class="ai-msg ai-msg-bot">' +
        '  <div class="ai-msg-avatar">🤖</div>' +
        '  <div class="ai-msg-bubble">' +
        '    <div class="ai-msg-sender">NyayaMitra AI</div>' +
        '    <div class="ai-msg-text">' + botConfirmText + '</div>' +
        '    <div class="ai-msg-time">' + timeStr + '</div>' +
        '  </div>' +
        '</div>';
        
      messagesContainer.insertAdjacentHTML('beforeend', botMsgHtml);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1200);
  }

  function sendAIMessage() {
    var inputEl = document.getElementById('ai-chat-input-text');
    if (!inputEl) return;
    var userText = inputEl.value.trim();
    if (!userText) return;
    
    var messagesContainer = document.getElementById('ai-chat-messages');
    if (!messagesContainer) return;
    
    var d = new Date();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var timeStr = hours + ':' + minutes + ' ' + ampm;
    
    // Add user message bubble
    var userMsgHtml = 
      '<div class="ai-msg ai-msg-user">' +
      '  <div class="ai-msg-avatar">👤</div>' +
      '  <div class="ai-msg-bubble">' +
      '    <div class="ai-msg-sender">You</div>' +
      '    <div class="ai-msg-text">' + userText + '</div>' +
      '    <div class="ai-msg-time">' + timeStr + '</div>' +
      '  </div>' +
      '</div>';
      
    messagesContainer.insertAdjacentHTML('beforeend', userMsgHtml);
    inputEl.value = '';
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Show typing indicator
    var typingIndicator = document.getElementById('ai-typing-indicator');
    if (typingIndicator) {
      typingIndicator.style.display = 'flex';
      messagesContainer.appendChild(typingIndicator);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Determine reply based on query
    var reply = '';
    var textLower = userText.toLowerCase();
    
    if (textLower.indexOf('fir') !== -1 || textLower.indexOf('complaint') !== -1 || textLower.indexOf('file') !== -1) {
      reply = "Under Indian Law, a First Information Report (FIR) can be filed by any person who has knowledge of a cognizable offense. You can file it digitally on our Citizen dashboard (by logging in as a citizen and navigating to the 'File FIR' tab) or by visiting the nearest police station. There is no charge for filing an FIR, and you are legally entitled to receive a copy of it free of cost.";
    } else if (textLower.indexOf('right') !== -1 || textLower.indexOf('ipc') !== -1 || textLower.indexOf('law') !== -1) {
      reply = "Every citizen has crucial rights when interacting with the law enforcement agencies under the IPC and CrPC: 1) The right to get a free copy of the FIR immediately; 2) The right to safety and dignity during custody; 3) The right of women to be questioned only in the presence of women officers and not after sunset or before sunrise; 4) The right to know the status of the investigation updates from the portal.";
    } else if (textLower.indexOf('cyber') !== -1 || textLower.indexOf('online fraud') !== -1 || textLower.indexOf('scam') !== -1) {
      reply = "To report cybercrimes (such as online financial fraud, identity theft, or social media harassment), please keep screenshots, transaction receipts, bank statements, and relevant URLs handy. You can file an official complaint online at cybercrime.gov.in, or select 'Cybercrime' as the incident type in our 'File New FIR' form on this portal.";
    } else if (textLower.indexOf('status') !== -1 || textLower.indexOf('track') !== -1 || textLower.indexOf('where') !== -1) {
      reply = "To track the progress of an active case or FIR, you can use the 'Track Your FIR' widget on our portal's main landing page by entering the FIR ID (e.g., #2024-0001). Alternatively, log in to your Citizen dashboard to view interactive timelines, case officers assigned, and investigator notes.";
    } else {
      reply = "Jai Hind! I have received your query. NyayaMitra is here to guide you on Indian legal procedures, FIR registration steps, and case tracking. Could you please specify if your query is regarding filing an FIR, checking status, or understanding citizen rights?";
    }
    
    // Delay and respond
    setTimeout(function() {
      if (typingIndicator) typingIndicator.style.display = 'none';
      
      var botMsgHtml = 
        '<div class="ai-msg ai-msg-bot">' +
        '  <div class="ai-msg-avatar">🤖</div>' +
        '  <div class="ai-msg-bubble">' +
        '    <div class="ai-msg-sender">NyayaMitra AI</div>' +
        '    <div class="ai-msg-text">' + reply + '</div>' +
        '    <div class="ai-msg-time">' + timeStr + '</div>' +
        '  </div>' +
        '</div>';
        
      messagesContainer.insertAdjacentHTML('beforeend', botMsgHtml);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 1200);
  }

  var isAIVoiceRecording = false;
  var aiVoiceTimeout = null;

  function toggleAIVoiceRecording() {
    var inputEl = document.getElementById('ai-chat-input-text');
    var wavesEl = document.getElementById('ai-chat-voice-waves');
    var micBtn = document.getElementById('ai-chat-voice-btn');
    if (!inputEl || !wavesEl || !micBtn) return;
    
    if (!isAIVoiceRecording) {
      // Start recording simulation
      isAIVoiceRecording = true;
      inputEl.style.display = 'none';
      wavesEl.style.display = 'flex';
      micBtn.classList.add('active');
      
      // Auto transcribe after 3 seconds
      aiVoiceTimeout = setTimeout(function() {
        stopAIVoiceRecording(true);
      }, 3000);
    } else {
      // Cancel recording simulation
      stopAIVoiceRecording(false);
    }
  }

  function stopAIVoiceRecording(autoFillText) {
    var inputEl = document.getElementById('ai-chat-input-text');
    var wavesEl = document.getElementById('ai-chat-voice-waves');
    var micBtn = document.getElementById('ai-chat-voice-btn');
    if (!inputEl || !wavesEl || !micBtn) return;
    
    isAIVoiceRecording = false;
    if (aiVoiceTimeout) {
      clearTimeout(aiVoiceTimeout);
      aiVoiceTimeout = null;
    }
    
    wavesEl.style.display = 'none';
    inputEl.style.display = 'block';
    micBtn.classList.remove('active');
    
    if (autoFillText) {
      // List of mock speech utterances
      var mockPhrases = [
        "How can I file a cybercrime complaint online?",
        "What are my basic rights when filing an FIR?",
        "How can I track the status of my registered FIR?",
        "What documents are required to register a theft complaint?"
      ];
      var randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      inputEl.value = randomPhrase;
      inputEl.focus();
    }
  }

  function findTabElement(name) {
    if (name === 'dashboard') {
      var tabs = document.querySelectorAll('.nav-tab');
      for (var i = 0; i < tabs.length; i++) {
        if (tabs[i].textContent.trim().toLowerCase() === 'dashboard') {
          return tabs[i];
        }
      }
    }
    return document.getElementById('tab-' + name);
  }

  function restoreSession() {
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      var u = sessionStorage.getItem('currentUser');
      var r = sessionStorage.getItem('currentRole');
      if (u && r && registeredUsers[u]) {
        isLoggedIn = true;
        setupUserUI(u, r);
        return true;
      }
    }
    return false;
  }

  function handleRouting() {
    var hash = window.location.hash || '#login';
    var route = hash.replace(/^#\/?/, '');
    
    if (route.indexOf('fir-detail/') === 0) {
      if (!isLoggedIn) {
        window.location.hash = 'login';
        return;
      }
      var firId = decodeURIComponent(route.substring('fir-detail/'.length));
      var success = renderFirDetail(firId);
      if (success) {
        showScreenInternal('fir-detail', null);
      } else {
        alert("FIR not found.");
        window.location.hash = 'dashboard';
      }
      return;
    }

    if (!isLoggedIn) {
      if (route === 'ai-chat') {
        openAIChatInternal();
        return;
      }
      showLoginInternal();
      if (window.location.hash !== '' && window.location.hash !== '#login') {
        window.location.hash = 'login';
      }
      return;
    }

    if (route === 'login') {
      logoutInternal();
      return;
    }

    if (route === 'ai-chat') {
      openAIChatInternal();
      return;
    }

    var validScreens = ['dashboard', 'fir-list', 'file-fir', 'officers', 'analytics', 'notifications'];
    if (validScreens.indexOf(route) !== -1) {
      showScreenInternal(route, findTabElement(route));
    } else {
      window.location.hash = 'dashboard';
    }
  }

  function toggleFaq(card) {
    card.classList.toggle('active');
  }

  window.addEventListener('hashchange', handleRouting);
  window.addEventListener('load', function() {
    restoreSession();
    handleRouting();
  });
