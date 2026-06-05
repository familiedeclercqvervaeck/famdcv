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
   UI - prijs update
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
  const name = document.getElementById("donorName").value.trim();
  const tree = document.getElementById("treeSelect").value;
  const shares = Number(document.getElementById("shares").value);

  if (!name || shares <= 0) {
    alert("Vul naam en geldig aantal in.");
    return;
  }

  try {
    // 1. huidige data ophalen
    const snapshot = await getDocs(collection(db, "donations"));

    let totals = {
      "Moseik": 0,
      "Hazelaar": 0
    };

    snapshot.forEach(doc => {
      const data = doc.data();
      totals[data.tree] += data.shares * SHARE_PRICE;
    });

    const current = totals[tree];
    const goal = TREES[tree].goal;

    const remaining = goal - current;

    if (remaining <= 0) {
      alert("Deze boom is al volledig gefinancierd 🌳");
      return;
    }

    const maxShares = Math.floor(remaining / SHARE_PRICE);

    if (shares > maxShares) {
      alert(`Maximaal ${maxShares} aandeel(s) mogelijk (€${remaining} resterend).`);
      return;
    }

    const amount = shares * SHARE_PRICE;

    // 2. opslaan in Firebase
    await addDoc(collection(db, "donations"), {
      donor: name,
      tree: tree,
      shares: shares,
      amount: amount,
      createdAt: new Date()
    });

    // 3. voucher tonen
    document.getElementById("voucher").classList.remove("hidden");

    document.getElementById("voucherContent").innerHTML = `
      <h3>🌳 Cadeaubon</h3>
      <p><strong>${name}</strong></p>
      <p>${shares} aandeel(s) in ${tree}</p>
      <p>€${amount}</p>
    `;

    alert("Schenking succesvol!");

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
    totals[data.tree] += data.shares * SHARE_PRICE;
  });

  Object.keys(TREES).forEach(tree => {
    const goal = TREES[tree].goal;
    const value = totals[tree];

    const percent = Math.min((value / goal) * 100, 100);

    const bar = document.getElementById(tree.toLowerCase() + "Bar");
    const text = document.getElementById(tree.toLowerCase() + "Text");

    if (bar && text) {
      bar.style.width = percent + "%";
      text.innerText = `€${value} / €${goal}`;
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
