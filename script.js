document.addEventListener("DOMContentLoaded", function () {
  const items = [
    "Pretty Woman (1990)",
    "Sleepless in Seattle (1993)",
    "Four Weddings and a Funeral (1994)",
    "While You Were Sleeping (1995)",
    "The Truth About Cats & Dogs (1996)",
    "My Best Friend's Wedding (1997)",
    "As Good as It Gets (1997)",
    "Notting Hill (1999)",
    "Runaway Bride (1999)",
    "10 Things I Hate About You (1999)",
    "Mickey Blue Eyes (1999)",
    "What Women Want (2000)",
    "Bridget Jones's Diary (2001)",
    "Serendipity (2001)",
    "The Wedding Planner (2001)",
    "Life or Something Like It (2002)",
    "Maid in Manhattan (2002)",
    "Two Weeks Notice (2002)",
    "How to Lose a Guy in 10 Days (2003)",
    "Love Actually (2003)",
    "Just Married (2003)",
    "Down with Love (2003)",
    "Something's Gotta Give (2003)",
    "13 Going on 30 (2004)",
    "50 First Dates (2004)",
    "Win a Date with Tad Hamilton! (2004)",
    "Shall We Dance? (2004)",
    "The Wedding Date (2005)",
    "Just Like Heaven (2005)",
    "The Holiday (2006)",
    "Something New (2006)",
    "Penelope (2006)",
    "Music and Lyrics (2007)",
    "27 Dresses (2008)",
    "Fool's Gold (2008)",
    "He's Just Not That Into You (2009)",
    "The Proposal (2009)",
  ];

  const unrankedItems = document.getElementById("unranked-items");
  const saveBtn = document.getElementById("save-btn");
  const loadBtn = document.getElementById("load-btn");
  const resetBtn = document.getElementById("reset-btn");

  let draggingElement = null;

  // Initialize items
  function initItems() {
    unrankedItems.innerHTML = "";

    items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "item";
      itemElement.textContent = item;
      itemElement.draggable = true;

      itemElement.addEventListener("dragstart", handleDragStart);
      itemElement.addEventListener("dragend", handleDragEnd);

      unrankedItems.appendChild(itemElement);
    });
  }

  // Drag and drop event handlers
  function handleDragStart(e) {
    draggingElement = e.target;
    e.target.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", e.target.textContent);
  }

  function handleDragEnd(e) {
    e.target.classList.remove("dragging");
    draggingElement = null;
  }

  function handleDragOver(e) {
    if (e.preventDefault) {
      e.preventDefault();
    }
    e.dataTransfer.dropEffect = "move";
    return false;
  }

  function handleDragEnter(e) {
    e.target.classList.add("drag-over");
  }

  function handleDragLeave(e) {
    e.target.classList.remove("drag-over");
  }

  function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    const dropZone = e.target.closest(".tier-items");
    if (!dropZone || !draggingElement) return;

    dropZone.appendChild(draggingElement);
    return false;
  }

  // Add drag and drop event listeners to tier containers
  document.querySelectorAll(".tier-items").forEach((tierItems) => {
    tierItems.addEventListener("dragover", handleDragOver);
    tierItems.addEventListener("dragenter", handleDragEnter);
    tierItems.addEventListener("dragleave", handleDragLeave);
    tierItems.addEventListener("drop", handleDrop);
  });

  // Save tierlist
  saveBtn.addEventListener("click", function () {
    const tierlist = {};

    document.querySelectorAll(".tier").forEach((tier) => {
      const tierName = tier.getAttribute("data-tier");
      const tierItems = Array.from(tier.querySelectorAll(".item")).map(
        (item) => item.textContent
      );
      tierlist[tierName] = tierItems;
    });

    const unranked = Array.from(unrankedItems.querySelectorAll(".item")).map(
      (item) => item.textContent
    );
    tierlist["unranked"] = unranked;

    const tierlistJSON = JSON.stringify(tierlist);
    localStorage.setItem("tierlist", tierlistJSON);

    alert("Tierlist saved successfully!");
  });

  // Load tierlist
  loadBtn.addEventListener("click", function () {
    const tierlistJSON = localStorage.getItem("tierlist");
    if (!tierlistJSON) {
      alert("No saved tierlist found!");
      return;
    }

    const tierlist = JSON.parse(tierlistJSON);

    // Clear all tiers
    document.querySelectorAll(".tier-items").forEach((container) => {
      container.innerHTML = "";
    });

    // Populate tiers
    Object.keys(tierlist).forEach((tierName) => {
      if (tierName === "unranked") {
        const container = document.getElementById("unranked-items");
        populateContainer(container, tierlist[tierName]);
      } else {
        const container = document.getElementById(
          `tier-${tierName.toLowerCase()}`
        );
        if (container) {
          populateContainer(container, tierlist[tierName]);
        }
      }
    });

    alert("Tierlist loaded successfully!");
  });

  function populateContainer(container, items) {
    items.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "item";
      itemElement.textContent = item;
      itemElement.draggable = true;

      itemElement.addEventListener("dragstart", handleDragStart);
      itemElement.addEventListener("dragend", handleDragEnd);

      container.appendChild(itemElement);
    });
  }

  // Reset tierlist
  resetBtn.addEventListener("click", function () {
    if (
      confirm(
        "Are you sure you want to reset the tierlist? All items will be moved back to the unranked section."
      )
    ) {
      document.querySelectorAll(".tier .item").forEach((item) => {
        unrankedItems.appendChild(item);
      });
    }
  });

  // Initialize the app
  initItems();
});
