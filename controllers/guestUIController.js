// Define groups and primary group
const groups = [];
let primaryGroup = null;

// Function to add a group
function addGroup() {
  const groupInput = document.getElementById("groupInput");
  const groupValue = groupInput.value.trim();

  if (!groupValue) {
    alert("Please enter a group name.");
    return;
  }

  // Prevent duplicates
  if (groups.includes(groupValue)) {
    alert("This group is already added.");
    return;
  }

  groups.push(groupValue); // Add group to list
  primaryGroup = primaryGroup || groupValue; // Set first group as primary
  updateGroupDisplay();
  groupInput.value = ""; // Clear input
}

// Function to update the group display
function updateGroupDisplay() {
  const groupsContainer = document.getElementById("groupsContainer");
  groupsContainer.innerHTML = ""; // Clear display

  groups.forEach((group) => {
    const groupTag = document.createElement("div");
    groupTag.className = "group-tag";
    groupTag.dataset.tooltip = "Set as primary"; // Tooltip text
    if (group === primaryGroup) groupTag.classList.add("primary");

    groupTag.textContent = group;

    // Set as primary on click
    groupTag.onclick = () => {
      primaryGroup = group;
      updateGroupDisplay();
    };

    // Add delete button inside tag
    const removeIcon = document.createElement("span");
    removeIcon.textContent = "x";
    removeIcon.onclick = (e) => {
      e.stopPropagation(); // Prevent primary toggle
      groups.splice(groups.indexOf(group), 1);
      if (primaryGroup === group) primaryGroup = null; // Clear primary if removed
      updateGroupDisplay();
    };

    groupTag.appendChild(removeIcon);
    groupsContainer.appendChild(groupTag);
  });
}

// Handle the guest form submission
document.getElementById("guestForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!primaryGroup) {
    alert("Please select a primary group.");
    return;
  }

  const guest = { name, phone, groups, primaryGroup, status: "Not Invited" };
  console.log("Guest added:", guest);

  // Clear form
  document.getElementById("guestForm").reset();
  groups.length = 0;
  primaryGroup = null;
  updateGroupDisplay();

  // Show success message
  const resultElement = document.getElementById("result");
  resultElement.textContent = "Guest added successfully!";
});
