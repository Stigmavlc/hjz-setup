// localStorage helpers for checkboxes and choices
const key = (id) => `hjz:${id}`;

// Toggle check visuals and persist
document.querySelectorAll(".check").forEach((el) => {
  const id = el.getAttribute("data-id");
  const saved = localStorage.getItem(key(id));
  if (saved === "1") {
    el.classList.add("done");
    el.setAttribute("aria-checked", "true");
  }
  el.addEventListener("click", () => {
    el.classList.toggle("done");
    const on = el.classList.contains("done");
    el.setAttribute("aria-checked", on ? "true" : "false");
    localStorage.setItem(key(id), on ? "1" : "0");
  });
});

// Radio persistence
document.querySelectorAll('input[type="radio"]').forEach((r) => {
  const id = r.id;
  const saved = localStorage.getItem(key(id));
  if (saved === "1") {
    r.checked = true;
  }
  r.addEventListener("change", () => {
    // clear group
    document
      .querySelectorAll(`input[name="${r.name}"]`)
      .forEach((s) => localStorage.removeItem(key(s.id)));
    localStorage.setItem(key(id), "1");
  });
});

// Textareas persistence
document.querySelectorAll("textarea").forEach((t) => {
  const id = t.placeholder || Math.random().toString(36).slice(2);
  t.dataset.pid = id;
  const saved = localStorage.getItem(key(id));
  if (saved) {
    t.value = saved;
  }
  t.addEventListener("input", () =>
    localStorage.setItem(key(id), t.value)
  );
});

// Copy buttons
document.querySelectorAll(".copy").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const val = btn.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(val);
      const old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => (btn.textContent = old), 1200);
    } catch (e) {
      alert("Copy failed. Please copy manually: " + val);
    }
  });
});

// Mark all and Reset
document.getElementById("markAll").addEventListener("click", () => {
  document.querySelectorAll(".check").forEach((el) => {
    el.classList.add("done");
    el.setAttribute("aria-checked", "true");
    localStorage.setItem(key(el.getAttribute("data-id")), "1");
  });
});

document.getElementById("resetAll").addEventListener("click", () => {
  if (!confirm("Reset all checkboxes and choices?")) return;
  document.querySelectorAll(".check").forEach((el) => {
    el.classList.remove("done");
    el.setAttribute("aria-checked", "false");
    localStorage.removeItem(key(el.getAttribute("data-id")));
  });
  document.querySelectorAll('input[type="radio"]').forEach((r) => {
    r.checked = false;
    localStorage.removeItem(key(r.id));
  });
  document.querySelectorAll("textarea").forEach((t) => {
    t.value = "";
    localStorage.removeItem(key(t.dataset.pid));
  });
});

// Send form to Ivan via email
document.getElementById("sendEmail").addEventListener("click", () => {
  let emailBody = "HJZ Setup Pack - Completed Form\n\n";
  emailBody += "=".repeat(50) + "\n\n";

  // Collect all checked items by section
  const sections = {
    "ServiceM8": ["sm8-1", "sm8-2"],
    "Google Calendar": ["gcal-1", "gcal-2"],
    "Google Business Profile": ["gbp-1"],
    "Google Drive / Sheets": ["gdrive-1", "gdrive-2"],
    "Stripe": ["stripe-1"],
    "WhatsApp Business": ["wa-1", "wa-2"],
    "ElevenLabs": ["11l-1", "11l-2"],
    "Airtable": ["air-1", "air-2", "air-3"],
    "Twilio": ["twi-1", "twi-2", "twi-3"],
    "WordPress": ["wp-1"]
  };

  emailBody += "COMPLETED TASKS:\n";
  emailBody += "-".repeat(50) + "\n";

  for (const [section, ids] of Object.entries(sections)) {
    const completed = ids.filter(id => {
      const el = document.querySelector(`[data-id="${id}"]`);
      return el && el.classList.contains("done");
    });

    if (completed.length > 0) {
      emailBody += `\n${section}: ${completed.length}/${ids.length} tasks completed\n`;
    }
  }

  // Collect choices
  emailBody += "\n\n" + "=".repeat(50) + "\n";
  emailBody += "CHOICES MADE:\n";
  emailBody += "-".repeat(50) + "\n";

  const choices = {
    "Working hours": "hours",
    "Service areas": "areas",
    "Deposit rules": "deposit",
    "Bookings location": "store",
    "WhatsApp timing": "wa",
    "Voice cloning": "voice"
  };

  for (const [label, name] of Object.entries(choices)) {
    const selected = document.querySelector(`input[name="${name}"]:checked`);
    if (selected) {
      const labelText = document.querySelector(`label[for="${selected.id}"]`).textContent;
      emailBody += `\n${label}: ${labelText}\n`;

      // Check for textarea answer
      const answer = selected.parentElement.querySelector("textarea");
      if (answer && answer.value.trim()) {
        emailBody += `  Answer: ${answer.value.trim()}\n`;
      }
    }
  }

  emailBody += "\n\n" + "=".repeat(50) + "\n";
  emailBody += "End of form\n";

  // Create mailto link
  const subject = encodeURIComponent("HJZ Setup Pack - Completed by Henry");
  const body = encodeURIComponent(emailBody);
  const mailtoLink = `mailto:ivanaguilarmari@gmail.com?subject=${subject}&body=${body}`;

  // Open email client
  window.location.href = mailtoLink;
});

// Before print: ensure all selections are visible
window.addEventListener("beforeprint", () => {
  // Show all textarea answers for printing
  document.querySelectorAll(".answer textarea").forEach((textarea) => {
    if (textarea.value.trim()) {
      textarea.style.display = "block";
      // Make textarea read-only appearance for print
      textarea.setAttribute("readonly", "true");
    }
  });

  // Ensure checked radios show their answers
  document.querySelectorAll('input[type="radio"]:checked').forEach((radio) => {
    const answer = radio.parentElement.querySelector(".answer");
    if (answer) {
      answer.style.display = "block";
    }
  });
});

// After print: restore normal state
window.addEventListener("afterprint", () => {
  document.querySelectorAll(".answer textarea").forEach((textarea) => {
    textarea.removeAttribute("readonly");
  });
});
