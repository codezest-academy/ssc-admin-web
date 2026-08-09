import Papa from "papaparse";

export const CSV_HEADERS = [
  "Question Text",
  "Option A",
  "Option B",
  "Option C",
  "Option D",
  "Correct Option",
  "Explanation",
  "Difficulty",
  "Is PYQ",
  "PYQ Year",
  "Tags (comma separated)",
];

export const downloadCSVTemplate = () => {
  const csv = Papa.unparse({
    fields: CSV_HEADERS,
    data: [
      [
        "What is the capital of France?",
        "Berlin",
        "Madrid",
        "Paris",
        "Rome",
        "C",
        "Paris is the capital of France.",
        "EASY",
        "TRUE",
        "2023",
        "Geography, Europe",
      ],
      [
        "Solve: 5 + 7 * 2",
        "24",
        "19",
        "12",
        "35",
        "B",
        "Using BODMAS, multiplication comes before addition: 7*2 = 14, then 14+5 = 19.",
        "MEDIUM",
        "FALSE",
        "",
        "Math, Arithmetic",
      ]
    ],
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "question_template.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
