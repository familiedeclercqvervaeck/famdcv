import { db } from "./firebase-config.js";

import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const shares = document.getElementById("shares");

shares.addEventListener("input", () => {
  document.getElementById("amount").innerText =
    "€" + (shares.value * 25);
});

document
  .getElementById("giftBtn")
  .addEventListener("click", async () => {

    const name =
      document.getElementById("donorName").value;

    const tree =
      document.getElementById("treeSelect").value;

    const shareCount =
      Number(document.getElementById("shares").value);

    const amount = shareCount * 25;

    try {

      await addDoc(
        collection(db, "donations"),
        {
          donor: name,
          tree: tree,
          shares: shareCount,
          amount: amount,
          createdAt: new Date()
        }
      );

      document
        .getElementById("voucher")
        .style.display = "block";

      document
        .getElementById("voucherContent")
        .innerHTML = `
          <h2>Voor Frederik, Evi, Sem & Jasper</h2>
          <p>Geschonken door: <strong>${name}</strong></p>
          <p>${shareCount} aandeel(en) voor ${tree}</p>
          <p>Bedrag: €${amount}</p>
        `;

      alert("Bedankt! Je schenking werd geregistreerd.");

    } catch (error) {
      console.error(error);
      alert("Er liep iets fout bij het opslaan.");
    }
});

async function loadProgress() {
  const snapshot = await getDocs(collection(db, "donations"));

  let moseik = 0;
  let hazelaar = 0;

  snapshot.forEach(doc => {
    const data = doc.data();

    if (data.tree === "Moseik") {
      moseik += data.shares;
    }

    if (data.tree === "Hazelaar") {
      hazelaar += data.shares;
    }
  });

  const goal = 100; // stel doel in (bv 100 aandelen)

  const moseikPercent = Math.min((moseik / goal) * 100, 100);
  const hazelaarPercent = Math.min((hazelaar / goal) * 100, 100);

  document.getElementById("moseikBar").style.width = moseikPercent + "%";
  document.getElementById("hazelaarBar").style.width = hazelaarPercent + "%";

  document.getElementById("moseikText").innerText =
    `${moseik} / ${goal} aandelen verkocht`;

  document.getElementById("hazelaarText").innerText =
    `${hazelaar} / ${goal} aandelen verkocht`;
}

loadProgress();
