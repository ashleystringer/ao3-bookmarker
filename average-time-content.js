const article = document.querySelector("article");
const workskin = document.querySelector("#workskin");

if (workskin) {
  const text = workskin.querySelector("#chapters").textContent;

  const wordMatchRegExp = /[^\s]+/g;
  const words = text.matchAll(wordMatchRegExp);

  const wordCount = [...words].length;

  const readingTimeMax = Math.round(wordCount / 200);
  const readingTimeMin = Math.round(wordCount / 250);

  console.log(
    `readingTimeMax: ${readingTimeMax}, readingTimeMin: ${readingTimeMin}`
  );

  const badge = document.createElement("p");
  badge.style.color = "#808080";
  badge.style.fontStyle = "italic";
  badge.innerText = `⏱️${readingTimeMin} - ${readingTimeMax} min read`;

  const bylineHeading = workskin.querySelector(".byline");

  bylineHeading.insertAdjacentElement("afterend", badge);
}
