import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* -----------------------------
   CONFIG
------------------------------*/

const SHARE_PRICE = 25;

const TREES = {
  "Moseik": {
    goal: 250
  },
  "Hazelaar": {
    goal: 250
  }
};

/* -----------------------------
   FORM - prijs live tonen
------------------------------*/

const sharesInput = document.getElementById("shares");
const amountText = document.getElementById("amount");

sharesInput.addEventListener("input", () => {
  const shares = Number(sharesInput.value || 0);
  amountText.innerText = "€" + (shares * SHARE_PRICE);
});

/* -----------------------------
   DONATION OPSLAAN
------------------------------*/

document.getElementById("giftBtn").addEventListener("click", async () => {
  const name = document.getElementById("donorName").value;
  const tree = document.getElementById("treeSelect").value;
  const shares = Number(document.getElementById("shares").value);
  const amount = shares * SHARE_PRICE;

  if (!name || shares <= 0) {
    alert("Vul naam en geldig aantal in.");
    return;
  }

  try {
    await addDoc(collection(db, "donations"), {
      donor: name,
      tree: tree,
      shares: shares,
      amount: amount,
      createdAt: new Date()
    });

    // voucher tonen
    document.getElementById("voucher").classList.remove("hidden");

    document.getElementById("voucherContent").innerHTML = `
      <h3>🌳 Cadeaubon</h3>
      <p><strong>${name}</strong></p>
      <p>${shares} aandeel(s) in ${tree}</p>
      <p>€${amount}</p>
    `;

    alert("Schenking opgeslagen!");

    loadProgress();

  } catch (err) {
    console.error(err);
    alert("Fout bij opslaan.");
  }
});

/* -----------------------------
   PROGRESS BARS
------------------------------*/

async function loadProgress() {
  const snapshot = await getDocs(collection(db, "donations"));

  let totals = {
    "Moseik": 0,
    "Hazelaar": 0
  };

  snapshot.forEach(doc => {
    const data = doc.data();

    const amount = data.shares * SHARE_PRICE;

    if (totals[data.tree] !== undefined) {
      totals[data.tree] += amount;
    }
  });

  // bereken progress %
  Object.keys(TREES).forEach(tree => {
    const percent = Math.min(
      (totals[tree] / TREES[tree].goal) * 100,
      100
    );

    const bar = document.getElementById(tree.toLowerCase() + "Bar");
    const text = document.getElementById(tree.toLowerCase() + "Text");

    if (bar && text) {
      bar.style.width = percent + "%";
      text.innerText = `€${totals[tree]} / €${TREES[tree].goal}`;
    }
  });
}

/* -----------------------------
   PDF DOWNLOAD
------------------------------*/

document.getElementById("downloadPdf").addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const name = document.getElementById("donorName").value;
  const tree = document.getElementById("treeSelect").value;
  const shares = Number(document.getElementById("shares").value);
  const amount = shares * SHARE_PRICE;

  doc.setFontSize(18);
  doc.text("🌳 Cadeaubon Instuif Bomen", 20, 20);

  doc.setFontSize(12);
  doc.text(`Naam: ${name}`, 20, 40);
  doc.text(`Boom: ${tree}`, 20, 50);
  doc.text(`Aandelen: ${shares}`, 20, 60);
  doc.text(`Bedrag: €${amount}`, 20, 70);

  doc.text("Bedankt voor je steun!", 20, 90);

  doc.save("cadeaubon.pdf");
});

/* -----------------------------
   INIT
------------------------------*/

loadProgress();
