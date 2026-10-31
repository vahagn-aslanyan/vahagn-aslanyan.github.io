(() => {
  'use strict';
  const moves = {
  "MGS slides.pdf": "assets/documents/slides/2025-12-05-domain-colouring.pdf",
  "MECD.pdf": "assets/documents/slides/2025-07-16-modular-existential-closedness-with-derivatives.pdf",
  "Vahagn -- Warwick slides.pdf": "assets/documents/slides/2025-07-02-modular-zilber-pink-with-derivatives.pdf",
  "Manchester_colloquium2023.pdf": "assets/documents/slides/2023-12-08-unlikely-intersections-manchester.pdf",
  "ManchesterNT2023.pdf": "assets/documents/slides/2023-11-28-differences-of-singular-moduli.pdf",
  "LogicColloquium.pdf": "assets/documents/slides/2023-06-07-existential-closedness-with-derivatives.pdf",
  "EC+ZP.pdf": "assets/documents/slides/2023-01-27-modular-existential-closedness-and-zilber-pink.pdf",
  "Reading22.pdf": "assets/documents/slides/2022-05-25-unlikely-intersections-reading.pdf",
  "Models and sets.pdf": "assets/documents/slides/2021-06-09-geometric-approach-exponential-equations.pdf",
  "Slides 2021.03.11.pdf": "assets/documents/slides/2021-03-11-geometric-approach-exponential-equations.pdf",
  "Manchester.pdf": "assets/documents/slides/2020-11-25-blurrings-of-the-j-function-manchester.pdf",
  "o-minimality.pdf": "assets/documents/slides/2020-11-24-introduction-to-o-minimality.pdf",
  "BerkeleyJune20.pdf": "assets/documents/slides/2020-06-16-blurrings-of-the-j-function-berkeley.pdf",
  "ZP slides.pdf": "assets/documents/slides/2020-04-15-introduction-to-zilber-pink.pdf",
  "SEEMOD2019.pdf": "assets/documents/slides/2019-12-11-strong-minimality-in-j-reducts.pdf",
  "UEA-2019.pdf": "assets/documents/slides/2019-11-11-atypical-intersections.pdf",
  "Oxford_Talk_2019.pdf": "assets/documents/slides/2019-11-07-functional-modular-zilber-pink.pdf",
  "ASL_Macomb.pdf": "assets/documents/slides/2018-05-16-ax-schanuel-and-strong-minimality.pdf",
  "Ax-SM-j.pdf": "assets/documents/slides/ax-schanuel-and-strong-minimality-for-j.pdf",
  "Aslanyan-CV.pdf": "assets/documents/cv/vahagn-aslanyan-cv.pdf",
  "thesis.pdf": "assets/documents/thesis/ax-schanuel-type-inequalities.pdf",
  "numbertheory.pdf": "assets/documents/notes/number-theory.pdf",
  "A grain of wheat.pdf": "assets/documents/writing/a-grain-of-wheat.pdf",
  "Poetry.pdf": "assets/documents/writing/poetry.pdf",
  "Bestiary.pdf": "assets/documents/writing/armenian-bestiary.pdf",
  "Translations.pdf": "assets/documents/writing/translations.pdf",
  "Favicon.jpg": "assets/images/favicon.jpg",
  "Fund_dom.jpg": "assets/images/fundamental-domains.jpg",
  "Fund_dom.png": "assets/images/fundamental-domains.png",
  "j.png": "assets/images/j-function.png",
  "me.jpg": "assets/images/vahagn-aslanyan.jpg",
  "o-min-pic.jpg": "assets/images/lecture-o-minimality.jpg"
};
  let pathname;
  try { pathname = decodeURIComponent(location.pathname); } catch { return; }
  const name = pathname.replace(/^\//, '');
  if (!Object.prototype.hasOwnProperty.call(moves, name)) return;
  const target = moves[name];
  if (!target) return;
  location.replace('/' + target + location.hash);
})();
