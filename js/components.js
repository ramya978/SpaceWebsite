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
      function (c) { return (c.code ) },
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
      // Sync hidden enquiry-type input with selected pill
      var enquiryInput = box.querySelector("[name=enquiry-type]");
      if (enquiryInput) enquiryInput.value = button.textContent.trim();
      // Sync hidden join-type input with selected pill
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

    // ---- Custom dropdown (select) for join-types / enquiry-types ----
    var select = box.querySelector("select[data-bind]");
    if (select) {
      select.addEventListener("change", function () {
        var selectedLabel = (this.options[this.selectedIndex] && this.options[this.selectedIndex].textContent) ? this.options[this.selectedIndex].textContent.trim() : "";
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

  // Toast helper
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

  // Clear per-field errors
  function clearFieldErrors(form) {
    form.querySelectorAll(".input-group, .phone-row").forEach(function (g) { g.classList.remove("error"); });
    form.querySelectorAll(".input-error").forEach(function (e) { e.textContent = ""; });
  }

  // Set per-field error
  function setFieldError(form, fieldName, message) {
    var input = form.querySelector("[name=" + fieldName + "]");
    var errorEl = form.querySelector("#error-" + fieldName);
    var group = input ? input.closest(".input-group, .phone-row") : null;
    if (group) group.classList.add("error");
    if (errorEl) errorEl.textContent = message;
  }

  // ---- Forms: submit to API ----
  document.querySelectorAll("form[data-form]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var getVal = function (selector) {
        var el = form.querySelector(selector);
        return el ? el.value.trim() : "";
      };
      var name = getVal("[name=name]");
      var email = getVal("[name=email]");
      var phoneCode = form.querySelector("[name=phone-code]") ? form.querySelector("[name=phone-code]").value : "";
      var phone = getVal("[name=phone]");
      var occupation = getVal("[name=occupation]");
      var enquiryType = getVal("[name=enquiry-type]");
      var message = getVal("[name=message]");
      var joinType = getVal("[name=join-type]");
      var country = getVal("[name=country]");
      var state = getVal("[name=state]");
      var city = getVal("[name=city]");
      var address = getVal("[name=address]");
      var organisation = getVal("[name=organisation]");
      var submitBtn = form.querySelector("button[type=submit]");
      var isJoinForm = !!form.querySelector("[name=join-type]");

      clearFieldErrors(form);

      var hasError = false;
      if (!name) { setFieldError(form, "name", "Please enter your full name."); hasError = true; }
      if (!email) { setFieldError(form, "email", "Please enter your email address."); hasError = true; }
      else if (!/.+@.+\..+/.test(email)) { setFieldError(form, "email", "Please enter a valid email address."); hasError = true; }
      if (!phone) { setFieldError(form, "phone", "Please enter your phone number."); hasError = true; }
      else if (phone.length < 10 || phone.length > 10) { setFieldError(form, "phone", "Phone number must be exactly 10 digits."); hasError = true; }

      if (isJoinForm) {
        if (!country) { setFieldError(form, "country", "Please select your country."); hasError = true; }
        if (!state) { setFieldError(form, "state", "Please enter your state."); hasError = true; }
        if (!city) { setFieldError(form, "city", "Please enter your city."); hasError = true; }
        if (!address) { setFieldError(form, "address", "Please enter your address."); hasError = true; }
        if (!message) { setFieldError(form, "message", "Please enter your message."); hasError = true; }
      } else {
        if (!occupation) { setFieldError(form, "occupation", "Please enter your occupation."); hasError = true; }
        if (!message) { setFieldError(form, "message", "Please enter your message."); hasError = true; }
      }

      if (hasError) {
        showToast("Please fix the highlighted fields.", "error");
        return;
      }

      var fullPhone = phoneCode ? phoneCode + phone : phone;

      if (isJoinForm) {
        var payload = {
          registrationType: joinType,
          fullName: name,
          email: email,
          phone: fullPhone,
          country: country,
          state: state,
          city: city,
          address: address,
          organisation: organisation,
          programmeInterests: message
        };
        var apiUrl = "https://ascendingsoftware.com/api/space/submit-registration.php";
      } else {
        var payload = {
          enquiryType: enquiryType,
          fullName: name,
          email: email,
          phone: fullPhone,
          occupation: occupation,
          message: message
        };
        var apiUrl = "https://ascendingsoftware.com/api/space/submit-enquiry.php";
      }

      if (submitBtn) submitBtn.disabled = true;

      fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (response) {
          if (!response.ok) {
            return response.json().then(function (errData) {
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
          // Remove error classes from all fields on success
          form.querySelectorAll(".input-group.error, .phone-row.error").forEach(function (g) {
            g.classList.remove("error");
          });
          form.querySelectorAll(".input-error").forEach(function (e) { e.textContent = ""; });
          if (isJoinForm) {
            var firstPill = form.querySelector("[data-role]:first-child");
            if (firstPill) {
              firstPill.classList.add("is-active");
              firstPill.setAttribute("aria-selected", "true");
              var joinTypeInput = form.querySelector("[name=join-type]");
              if (joinTypeInput) joinTypeInput.value = firstPill.textContent.trim();
            }
          } else {
            var firstPill = form.querySelector("[data-role]:first-child");
            if (firstPill) {
              firstPill.classList.add("is-active");
              firstPill.setAttribute("aria-selected", "true");
              var enquiryInput = form.querySelector("[name=enquiry-type]");
              if (enquiryInput) enquiryInput.value = firstPill.textContent.trim();
            }
          }
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