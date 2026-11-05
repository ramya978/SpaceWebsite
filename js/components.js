/* Interactive components: tabs, course explorer, join/contact forms, glossary. */

(function () {
  // ISO 2-letter country codes for dropdown labels (IN India, US United States, etc.)
  var ISO_CODES = {
    "Afghanistan": "AF", "Albania": "AL", "Algeria": "DZ", "Andorra": "AD", "Angola": "AO",
    "Antigua and Barbuda": "AG", "Argentina": "AR", "Armenia": "AM", "Australia": "AU", "Austria": "AT",
    "Azerbaijan": "AZ", "Bahamas": "BS", "Bahrain": "BH", "Bangladesh": "BD", "Barbados": "BB",
    "Belarus": "BY", "Belgium": "BE", "Belize": "BZ", "Benin": "BJ", "Bhutan": "BT",
    "Bolivia": "BO", "Bosnia and Herzegovina": "BA", "Botswana": "BW", "Brazil": "BR", "Brunei": "BN",
    "Bulgaria": "BG", "Burkina Faso": "BF", "Burundi": "BI", "Cabo Verde": "CV", "Cambodia": "KH",
    "Cameroon": "CM", "Canada": "CA", "Central African Republic": "CF", "Chad": "TD", "Chile": "CL",
    "China": "CN", "Colombia": "CO", "Comoros": "KM", "Congo (DRC)": "CD", "Congo (Republic)": "CG",
    "Costa Rica": "CR", "Croatia": "HR", "Cuba": "CU", "Cyprus": "CY", "Czech Republic": "CZ",
    "Denmark": "DK", "Djibouti": "DJ", "Dominica": "DM", "Dominican Republic": "DO", "Ecuador": "EC",
    "Egypt": "EG", "El Salvador": "SV", "Equatorial Guinea": "GQ", "Eritrea": "ER", "Estonia": "EE",
    "Eswatini": "SZ", "Ethiopia": "ET", "Fiji": "FJ", "Finland": "FI", "France": "FR",
    "Gabon": "GA", "Gambia": "GM", "Georgia": "GE", "Germany": "DE", "Ghana": "GH",
    "Greece": "GR", "Grenada": "GD", "Guatemala": "GT", "Guinea": "GN", "Guinea-Bissau": "GW",
    "Guyana": "GY", "Haiti": "HT", "Honduras": "HN", "Hungary": "HU", "Iceland": "IS",
    "India": "IN", "Indonesia": "ID", "Iran": "IR", "Iraq": "IQ", "Ireland": "IE",
    "Israel": "IL", "Italy": "IT", "Jamaica": "JM", "Japan": "JP", "Jordan": "JO",
    "Kazakhstan": "KZ", "Kenya": "KE", "Kiribati": "KI", "Kuwait": "KW", "Kyrgyzstan": "KG",
    "Laos": "LA", "Latvia": "LV", "Lebanon": "LB", "Lesotho": "LS", "Liberia": "LR",
    "Libya": "LY", "Liechtenstein": "LI", "Lithuania": "LT", "Luxembourg": "LU", "Madagascar": "MG",
    "Malawi": "MW", "Malaysia": "MY", "Maldives": "MV", "Mali": "ML", "Malta": "MT",
    "Marshall Islands": "MH", "Mauritania": "MR", "Mauritius": "MU", "Mexico": "MX", "Micronesia": "FM",
    "Moldova": "MD", "Monaco": "MC", "Mongolia": "MN", "Montenegro": "ME", "Morocco": "MA",
    "Mozambique": "MZ", "Myanmar": "MM", "Namibia": "NA", "Nauru": "NR", "Nepal": "NP",
    "Netherlands": "NL", "New Zealand": "NZ", "Nicaragua": "NI", "Niger": "NE", "Nigeria": "NG",
    "North Korea": "KP", "North Macedonia": "MK", "Norway": "NO", "Oman": "OM", "Pakistan": "PK",
    "Palau": "PW", "Palestine": "PS", "Panama": "PA", "Papua New Guinea": "PG", "Paraguay": "PY",
    "Peru": "PE", "Philippines": "PH", "Poland": "PL", "Portugal": "PT", "Qatar": "QA",
    "Romania": "RO", "Russia": "RU", "Rwanda": "RW", "Saint Kitts and Nevis": "KN", "Saint Lucia": "LC",
    "Saint Vincent": "VC", "Samoa": "WS", "San Marino": "SM", "Sao Tome and Principe": "ST", "Saudi Arabia": "SA",
    "Senegal": "SN", "Serbia": "RS", "Seychelles": "SC", "Sierra Leone": "SL", "Singapore": "SG",
    "Slovakia": "SK", "Slovenia": "SI", "Solomon Islands": "SB", "Somalia": "SO", "South Africa": "ZA",
    "South Korea": "KR", "South Sudan": "SS", "Spain": "ES", "Sri Lanka": "LK", "Sudan": "SD",
    "Suriname": "SR", "Sweden": "SE", "Switzerland": "CH", "Syria": "SY", "Taiwan": "TW",
    "Tajikistan": "TJ", "Tanzania": "TZ", "Thailand": "TH", "Timor-Leste": "TL", "Togo": "TG",
    "Tonga": "TO", "Trinidad and Tobago": "TT", "Tunisia": "TN", "Turkey": "TR", "Turkmenistan": "TM",
    "Tuvalu": "TV", "Uganda": "UG", "Ukraine": "UA", "United Arab Emirates": "AE", "United Kingdom": "GB",
    "United States": "US", "Uruguay": "UY", "Uzbekistan": "UZ", "Vanuatu": "VU", "Vatican City": "VA",
    "Venezuela": "VE", "Vietnam": "VN", "Yemen": "YE", "Zambia": "ZM", "Zimbabwe": "ZW"
  };

  var site = window.SITE || {};

  // placeholder: optional text for an empty first option (value ""), selected by default
  function populateSelects(bindKey, items, labelFn, valueFn, defaultValue, placeholder) {
    document.querySelectorAll("[data-bind=\"" + bindKey + "\"]").forEach(function (sel) {
      sel.innerHTML = "";
      if (placeholder !== undefined) {
        var empty = document.createElement("option");
        empty.value = "";
        empty.textContent = placeholder;
        empty.selected = true;
        empty.defaultSelected = true; // form.reset() goes back to this
        sel.appendChild(empty);
      }
      items.forEach(function (item) {
        var opt = document.createElement("option");
        opt.value = valueFn(item);
        opt.textContent = labelFn(item);
        if (defaultValue !== undefined && opt.value === defaultValue) {
          opt.selected = true;
          opt.defaultSelected = true; // form.reset() keeps this default
        }
        sel.appendChild(opt);
      });
    });
  }

  function populatePills(bindKey, items, defaultValue) {
    document.querySelectorAll("[data-bind=\"" + bindKey + "\"]").forEach(function (container) {
      container.innerHTML = "";
      items.forEach(function (item, index) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "pill";
        btn.role = "tab";
        btn.dataset.role = "true";
        btn.dataset.title = item.label;
        btn.dataset.desc = item.desc || "";
        btn.dataset.label = item.desc || "";
        btn.textContent = item.label;
        if (defaultValue !== undefined && index === 0) {
          btn.classList.add("is-active");
          btn.setAttribute("aria-selected", "true");
        }
        container.appendChild(btn);
      });
    });
  }

  if (site.countryCodes) {
    populateSelects("country-codes", site.countryCodes,
      function (c) { return (c.code) },
      function (c) { return c.code; }, "+91");
    // Country starts empty (no country pre-selected)
    populateSelects("countries", site.countryCodes,
      function (c) { return c.name; },
      function (c) { return c.name; }, undefined, "Select country");
  }
  if (site.enquiryTypes) {
    populateSelects("enquiry-types", site.enquiryTypes,
      function (t) { return t.label; },
      function (t) { return t.label; }, undefined, "Select enquiry type");
  }
  if (site.joinTypes) {
    populateSelects("join-types", site.joinTypes,
      function (t) { return t.label; },
      function (t) { return t.label; }, undefined, "Select pathway");
  }

  // ---- Tabs ----
  // Markup: an element with data-tabs that holds buttons [data-tab-target="x"]
  // and panels [data-tab-panel="x"]. Used by the course explorer.
  document.querySelectorAll("[data-tabs]").forEach(function (box) {
    var buttons = box.querySelectorAll("[data-tab-target]");
    var panels = box.querySelectorAll("[data-tab-panel]");

    function show(name) {
      buttons.forEach(function (b) {
        var on = b.dataset.tabTarget === name;
        b.classList.toggle("is-active", on);
        b.setAttribute("aria-selected", on);
      });
      panels.forEach(function (p) {
        var on = p.dataset.tabPanel === name;
        p.hidden = !on;
        if (on) {
          // Restart the slide-in animation each time
          p.classList.remove("is-swapping");
          void p.offsetWidth;
          p.classList.add("is-swapping");
        }
      });
    }

    buttons.forEach(function (b) {
      b.addEventListener("click", function () { show(b.dataset.tabTarget); });
    });
  });

  // ---- Join / Contact: choosing a pathway changes the heading and hint ----
  // Buttons carry data-title, data-desc and (optionally) data-label.
  document.querySelectorAll("[data-role-form]").forEach(function (box) {
    var buttons = box.querySelectorAll("[data-role]");
    var title = box.querySelector("[data-role-title]");
    var desc = box.querySelector("[data-role-desc]");
    var label = box.querySelector("[data-role-label]");
    var body = box.querySelector(".panel-body");
    var status = box.querySelector(".form-status");

    function choose(button) {
      buttons.forEach(function (b) {
        b.classList.toggle("is-active", b === button);
        b.setAttribute("aria-selected", b === button);
      });
      title.textContent = button.dataset.title;
      desc.textContent = button.dataset.desc;
      if (label && button.dataset.label) label.textContent = button.dataset.label;
      if (status) status.textContent = "";
      var enquiryInput = box.querySelector("[name=enquiry-type]");
      if (enquiryInput) enquiryInput.value = button.textContent.trim();
      var joinTypeInput = box.querySelector("[name=join-type]");
      if (joinTypeInput) joinTypeInput.value = button.textContent.trim();
      body.classList.remove("is-swapping");
      void body.offsetWidth;
      body.classList.add("is-swapping");
    }

    // Use event delegation for dynamically rendered pills
    var pillRow = box.querySelector(".pill-row");
    if (pillRow) {
      pillRow.addEventListener("click", function (e) {
        var btn = e.target.closest(".pill");
        if (btn) choose(btn);
      });
    } else {
      buttons.forEach(function (b) {
        b.addEventListener("click", function () { choose(b); });
      });
    }
    if (buttons.length > 0) choose(buttons[0]);

    // ---- Dropdown (select) for join-types / enquiry-types ----
    var select = box.querySelector("select[data-bind]");
    if (select) {
      select.addEventListener("change", function () {
        var selectedLabel = (this.options[this.selectedIndex] && this.value) ? this.options[this.selectedIndex].textContent.trim() : "";
        var bindKey = this.dataset.bind;
        var items = bindKey === "enquiry-types" ? (site.enquiryTypes || []) : (site.joinTypes || []);
        var item = items.find(function (t) { return t.label === selectedLabel; });
        if (title) title.textContent = item ? item.label : selectedLabel;
        if (desc) desc.textContent = item ? (item.desc || "") : "";
        if (label && item && item.desc) label.textContent = item.desc;
        if (status) status.textContent = "";
        var enquiryInput = box.querySelector("[name=enquiry-type]");
        if (enquiryInput) enquiryInput.value = selectedLabel;
        var joinTypeInput = box.querySelector("[name=join-type]");
        if (joinTypeInput) joinTypeInput.value = selectedLabel;
        body.classList.remove("is-swapping");
        void body.offsetWidth;
        body.classList.add("is-swapping");
      });
    }
  });

  // ---- Toast helper ----
  function showToast(message, type) {
    var container = document.querySelector(".toast-container");
    if (!container) return;
    var toast = document.createElement("div");
    toast.className = "toast toast--" + type;
    toast.setAttribute("role", type === "error" ? "alert" : "status");
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(function () { toast.remove(); }, 3100);
  }

  /* =========================================================
     VALIDATION
     Min / max lengths are read from the HTML minlength / maxlength
     attributes first, so you only change limits in one place.
     The numbers below are fallbacks if an attribute is missing.
     ========================================================= */
  var NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.'-]*$/u;      // letters, spaces, . ' -
  var PLACE_RE = /^[\p{L}\p{M}][\p{L}\p{M}\s.,'()-]*$/u;  // letters, spaces, . , ' ( ) -
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  var RULES = {
    name: {
      label: "Full name", required: true, min: 2, max: 100,
      requiredMsg: "Please enter your full name.",
      pattern: NAME_RE, patternMsg: "Full name can contain only letters, spaces and . ' -"
    },
    email: {
      label: "Email", required: true, min: 6, max: 250,
      requiredMsg: "Please enter your email address.",
      pattern: EMAIL_RE, patternMsg: "Please enter a valid email address (e.g. name@example.com)."
    },
    phone: {
      label: "Phone number", required: true,
      requiredMsg: "Please enter your phone number.",
      custom: validatePhone
    },
    country: {
      label: "Country", required: true,
      requiredMsg: "Please select your country."
    },
    state: {
      label: "State", required: true, min: 2, max: 100,
      requiredMsg: "Please enter your state.",
      pattern: PLACE_RE, patternMsg: "State can contain only letters, spaces and . , ' ( ) -"
    },
    city: {
      label: "City", required: true, min: 2, max: 100,
      requiredMsg: "Please enter your city.",
      pattern: PLACE_RE, patternMsg: "City can contain only letters, spaces and . , ' ( ) -"
    },
    address: {
      label: "Address", required: true, min: 5, max: 250,
      requiredMsg: "Please enter your address."
    },
    organisation: {
      label: "Organisation", required: false, min: 2, max: 150
    },
    occupation: {
      label: "Occupation", required: true, min: 2, max: 100,
      requiredMsg: "Please enter your occupation."
    },
    message: {
      label: "Message", required: true, min: 10, max: 250,
      requiredMsg: "Please enter your message."
    }
  };
  var FIELD_ORDER = Object.keys(RULES);

  function getField(form, fieldName) {
    return form.querySelector("[name=\"" + fieldName + "\"]");
  }

  function getGroup(el) {
    return el ? el.closest(".input-group, .phone-row") : null;
  }

  // Finds the error span inside the field's own group (works whatever its id is)
  function getErrorEl(el) {
    var group = getGroup(el);
    return group ? group.querySelector(".input-error") : null;
  }

  function setFieldError(form, fieldName, message) {
    var el = getField(form, fieldName);
    if (!el) return;
    var group = getGroup(el);
    var errorEl = getErrorEl(el);
    if (group) group.classList.add("error");
    el.setAttribute("aria-invalid", "true");
    if (errorEl) {
      errorEl.textContent = message;
      if (errorEl.id) el.setAttribute("aria-describedby", errorEl.id);
    }
  }

  function clearFieldError(form, fieldName) {
    var el = getField(form, fieldName);
    if (!el) return;
    var group = getGroup(el);
    var errorEl = getErrorEl(el);
    if (group) group.classList.remove("error");
    el.removeAttribute("aria-invalid");
    if (errorEl) errorEl.textContent = "";
  }

  function clearAllErrors(form) {
    FIELD_ORDER.forEach(function (n) { clearFieldError(form, n); });
    clearPathwayError(form);
  }

  function getPhoneCode(form) {
    var code = form.querySelector("[name=phone-code]");
    return code ? code.value : "";
  }

  function validatePhone(form, value) {
    var digits = value.replace(/[\s-]/g, "");
    if (!/^\d+$/.test(digits)) return "Phone number can contain only digits.";
    if (getPhoneCode(form) === "+91") {
      if (digits.length !== 10) return "Indian mobile numbers must be exactly 10 digits (you entered " + digits.length + ").";
      if (!/^[6-9]/.test(digits)) return "Indian mobile numbers start with 6, 7, 8 or 9.";
      return "";
    }
    if (digits.length < 6) return "Phone number must be at least 6 digits.";
    if (digits.length > 14) return "Phone number must be no more than 14 digits.";
    return "";
  }

  // Returns the error message ("" when valid) and updates the UI
  function validateField(form, fieldName) {
    var rule = RULES[fieldName];
    var el = getField(form, fieldName);
    if (!rule || !el) return "";

    var value = el.value.trim();
    var min = el.minLength > 0 ? el.minLength : (rule.min || 0);
    var max = el.maxLength > 0 ? el.maxLength : (rule.max || 0);
    var msg = "";

    if (!value) {
      if (rule.required) msg = rule.requiredMsg || ("Please enter your " + rule.label.toLowerCase() + ".");
    } else if (rule.custom) {
      msg = rule.custom(form, value);
    } else if (el.tagName !== "SELECT" && min && value.length < min) {
      msg = rule.label + " must be at least " + min + " characters (currently " + value.length + ").";
    } else if (el.tagName !== "SELECT" && max && value.length > max) {
      msg = rule.label + " must be no more than " + max + " characters (currently " + value.length + ").";
    } else if (rule.pattern && !rule.pattern.test(value)) {
      msg = rule.patternMsg;
    }

    if (msg) setFieldError(form, fieldName, msg);
    else clearFieldError(form, fieldName);
    return msg;
  }

  // ---- Pathway (join form only) ----
  function getPathwayBox(form) {
    var box = form.closest("[data-role-form]");
    return box ? box.querySelector("[data-role-form-select]") : null;
  }

  function getPathwaySelect(form) {
    var box = getPathwayBox(form);
    return box ? box.querySelector("select[data-bind=\"join-types\"]") : null;
  }

  function validatePathway(form) {
    var box = getPathwayBox(form);
    var sel = getPathwaySelect(form);
    if (!sel) return "";
    var msg = sel.value ? "" : "Please choose a pathway before submitting.";
    var errorEl = box.querySelector(".input-error");
    box.classList.toggle("error", !!msg);
    if (errorEl) errorEl.textContent = msg;
    return msg;
  }

  function clearPathwayError(form) {
    var box = getPathwayBox(form);
    if (!box) return;
    box.classList.remove("error");
    var errorEl = box.querySelector(".input-error");
    if (errorEl) errorEl.textContent = "";
  }

  function validateForm(form, isJoinForm) {
    var firstInvalid = null;
    if (isJoinForm && validatePathway(form)) {
      var box = getPathwayBox(form);
      firstInvalid = box.querySelector(".join-pathway-pill") || box;
    }
    FIELD_ORDER.forEach(function (n) {
      if (validateField(form, n) && !firstInvalid) firstInvalid = getField(form, n);
    });
    return firstInvalid;
  }

  function focusField(el) {
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    if (typeof el.focus === "function") el.focus({ preventScroll: true });
  }

  // ---- Live validation: check on blur, re-check while fixing ----
  function setupLiveValidation(form) {
    FIELD_ORDER.forEach(function (n) {
      var el = getField(form, n);
      if (!el) return;
      el.addEventListener("blur", function () {
        if (el.value.trim() || form.dataset.submitted === "true") validateField(form, n);
      });
      el.addEventListener(el.tagName === "SELECT" ? "change" : "input", function () {
        var group = getGroup(el);
        if (el.tagName === "SELECT" || (group && group.classList.contains("error"))) validateField(form, n);
      });
    });
  }

  // ---- Phone: digits only, length limit follows the country code ----
  function setupPhone(form) {
    var phone = getField(form, "phone");
    if (!phone) return;
    var code = form.querySelector("[name=phone-code]");
    phone.setAttribute("inputmode", "numeric");

    function updateMax() {
      phone.maxLength = (code && code.value === "+91") ? 10 : 14;
      if (phone.value.length > phone.maxLength) phone.value = phone.value.slice(0, phone.maxLength);
    }

    phone.addEventListener("input", function () {
      var clean = phone.value.replace(/\D/g, "");
      if (clean !== phone.value) phone.value = clean;
    });
    if (code) {
      code.addEventListener("change", function () {
        updateMax();
        if (phone.value) validateField(form, "phone");
      });
    }
    updateMax();
  }

  // ---- Character counter with min / max text for textareas ----
  function setupCounters(form) {
    form.querySelectorAll("textarea[maxlength]").forEach(function (ta) {
      var counter = document.createElement("small");
      counter.className = "char-count";
      counter.setAttribute("aria-live", "polite");
      ta.insertAdjacentElement("afterend", counter);

      function update() {
        var len = ta.value.length;
        var min = ta.minLength > 0 ? ta.minLength : 0;
        var max = ta.maxLength;
        counter.textContent = (min ? "Min " + min + " · " : "") + len + " / " + max + " characters";
        counter.classList.toggle("is-short", len > 0 && len < min);
        counter.classList.toggle("is-full", len >= max);
      }
      ta.addEventListener("input", update);
      form.addEventListener("reset", function () { setTimeout(update, 0); });
      update();
    });
  }

  // ---- Forms: validate, then submit to API ----
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    var isJoinForm = !!form.querySelector("[name=join-type]");
    var pathwaySelect = getPathwaySelect(form);

    setupPhone(form);
    setupCounters(form);
    setupLiveValidation(form);

    if (pathwaySelect) {
      pathwaySelect.addEventListener("change", function () {
        if (pathwaySelect.value) clearPathwayError(form);
      });
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      form.dataset.submitted = "true";

      var firstInvalid = validateForm(form, isJoinForm);
      if (firstInvalid) {
        showToast("Please fix the highlighted fields.", "error");
        focusField(firstInvalid);
        return;
      }

      var getVal = function (fieldName) {
        var el = getField(form, fieldName);
        return el ? el.value.trim() : "";
      };
      var phoneCode = getPhoneCode(form);
      var phone = getVal("phone").replace(/\D/g, "");
      var fullPhone = phoneCode ? phoneCode + phone : phone;
      var submitBtn = form.querySelector("button[type=submit]");
      var payload, apiUrl;

      if (isJoinForm) {
        payload = {
          registrationType: getVal("join-type") || (pathwaySelect ? pathwaySelect.value : ""),
          fullName: getVal("name"),
          email: getVal("email"),
          phone: fullPhone,
          country: getVal("country"),
          state: getVal("state"),
          city: getVal("city"),
          address: getVal("address"),
          organisation: getVal("organisation"),
          programmeInterests: getVal("message")
        };
        apiUrl = "https://space-1.space/api/submit-registration.php";
      } else {
        payload = {
          enquiryType: getVal("enquiry-type"),
          fullName: getVal("name"),
          email: getVal("email"),
          phone: fullPhone,
          occupation: getVal("occupation"),
          message: getVal("message")
        };
        apiUrl = "https://space-1.space/api/submit-enquiry.php";
      }

      if (submitBtn) submitBtn.disabled = true;

      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().catch(function () { return null; }).then(function (errData) {
              var errMsg = (errData && errData.message) ? errData.message : "Server responded with status " + response.status;
              throw new Error(errMsg);
            });
          }
          return response.json();
        })
        .then(function (data) {
          var successMsg = (data && data.message) ? data.message : (isJoinForm ? "Thank you! Your registration has been submitted successfully." : "Thank you! Your enquiry has been submitted successfully.");
          showToast(successMsg, "success");

          form.reset(); // country goes back to "Select country", phone code back to +91
          form.dataset.submitted = "";
          clearAllErrors(form);

          // Let the custom phone-code button show +91 again
          var code = form.querySelector("[name=phone-code]");
          if (code) code.dispatchEvent(new Event("change", { bubbles: true }));

          // Keep the chosen pathway in sync with the hidden input
          var joinTypeInput = getField(form, "join-type");
          if (isJoinForm && joinTypeInput && pathwaySelect) joinTypeInput.value = pathwaySelect.value;
        })
        .catch(function (error) {
          console.error("Submission error:", error);
          var errMsg = (error && error.message) ? error.message : "Sorry, something went wrong. Please try again.";
          showToast(errMsg, "error");
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  });


  // ---- Glossary: filter terms as the visitor types ----
  var glossary = document.querySelector("[data-glossary]");
  if (glossary) {
    var input = glossary.querySelector("input");
    var items = glossary.querySelectorAll("dl > div");
    var empty = glossary.querySelector(".glossary-empty");

    input.addEventListener("input", function () {
      var query = input.value.trim().toLowerCase();
      var shown = 0;
      items.forEach(function (item) {
        var match = !query || item.textContent.toLowerCase().indexOf(query) !== -1;
        item.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
    });
  }
})();