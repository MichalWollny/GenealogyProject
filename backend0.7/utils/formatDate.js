// Function to make date TT.MM.JJJJ
export const formatDate = (date) => {
  if (!date) return null;

  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0"); // Monate sind nullbasiert
  const year = d.getFullYear();

  return `${day}.${month}.${year}`;
};
