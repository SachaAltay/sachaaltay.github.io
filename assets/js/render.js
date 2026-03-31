// === SHOW MORE / SHOW LESS TOGGLE ===
function toggleShowMore(btn, hiddenId) {
  var hidden = document.getElementById(hiddenId);
  if (hidden.style.display === "none") {
    hidden.style.display = "";
    btn.textContent = "Show less";
  } else {
    hidden.style.display = "none";
    btn.textContent = "Show all (" + hidden.children.length + " more)";
  }
}

// === HELPER: sort items by year descending ===
function sortByYear(items) {
  return [...items].sort(function(a, b) { return b.year - a.year; });
}

// Unique ID counter
var _uid = 0;
function uid() { return "showmore-" + (++_uid); }

// === HELPER: get favicon URL from a page URL ===
function faviconUrl(url) {
  try {
    var domain = new URL(url).hostname;
    return "https://www.google.com/s2/favicons?domain=" + domain + "&sz=64";
  } catch(e) {
    return "";
  }
}

// === FEATURED TALKS (YouTube video grid) ===
function renderFeaturedTalks(containerId) {
  var container = document.getElementById(containerId);
  if (!container || !SITE_DATA.featuredTalks) return;

  SITE_DATA.featuredTalks.forEach(function(talk) {
    var card = document.createElement("div");
    card.className = "video-card";

    var thumbUrl = "https://img.youtube.com/vi/" + talk.youtubeId + "/mqdefault.jpg";
    var videoUrl = "https://www.youtube.com/watch?v=" + talk.youtubeId;

    card.innerHTML =
      "<a href='" + videoUrl + "' target='_blank' rel='noopener'>" +
        "<div class='thumb-wrapper'>" +
          "<img src='" + thumbUrl + "' alt='" + talk.title + "' loading='lazy'>" +
          "<div class='play-btn'><svg viewBox='0 0 24 24'><polygon points='5,3 19,12 5,21'/></svg></div>" +
        "</div>" +
        "<div class='video-info'>" +
          "<div class='video-title'>" + talk.title + "</div>" +
          "<div class='video-meta'>" + talk.venue + " (" + talk.year + ")</div>" +
        "</div>" +
      "</a>";

    container.appendChild(card);
  });
}

// === PODCAST CAROUSEL ===
function renderPodcastCarousel(containerId) {
  var container = document.getElementById(containerId);
  if (!container || !SITE_DATA.podcasts) return;

  var sorted = sortByYear(SITE_DATA.podcasts);

  sorted.forEach(function(pod) {
    var card = document.createElement("div");
    card.className = "podcast-card";

    var favicon = pod.url ? faviconUrl(pod.url) : "";

    card.innerHTML =
      "<a href='" + pod.url + "' target='_blank' rel='noopener'>" +
        (favicon ? "<img class='podcast-favicon' src='" + favicon + "' alt='' loading='lazy'>" : "") +
        "<div class='podcast-card-body'>" +
          "<div class='podcast-show'>" + pod.show + "</div>" +
          "<div class='podcast-title'>" + pod.title + "</div>" +
          "<div class='podcast-year'>" + pod.year + "</div>" +
        "</div>" +
      "</a>";

    container.appendChild(card);
  });
}

// === PRESS MENTIONS CAROUSEL (with favicons) ===
function renderPressCarousel(container) {
  var sorted = sortByYear(SITE_DATA.pressMentions);
  // Show top items with URLs as cards
  var preview = sorted;

  var carousel = document.createElement("div");
  carousel.className = "press-carousel";

  preview.forEach(function(item) {
    var card = document.createElement("div");
    card.className = "press-card";

    var favicon = item.url ? faviconUrl(item.url) : "";
    var inner =
      (favicon ? "<img class='press-favicon' src='" + favicon + "' alt='' loading='lazy'>" : "") +
      "<div class='press-card-body'>" +
        "<div class='press-outlet'>" + item.outlet + "</div>" +
        "<div class='press-title'>" + item.title + "</div>" +
        "<div class='press-year'>" + item.year + "</div>" +
      "</div>";

    if (item.url) {
      card.innerHTML = "<a href='" + item.url + "' target='_blank' rel='noopener'>" + inner + "</a>";
    } else {
      card.innerHTML = "<div style='display:flex;gap:12px;padding:14px;align-items:flex-start'>" + inner + "</div>";
    }

    carousel.appendChild(card);
  });

  container.appendChild(carousel);
}

// === HELPER: get a screenshot thumbnail URL for a page ===
function thumbUrl(url) {
  try {
    // Use Google's PageSpeed Insights screenshot API (free, reliable)
    return "https://image.thum.io/get/width/600/" + url;
  } catch(e) {
    return "";
  }
}

// === SHARED: render pub thumbnail cards ===
function renderPubCards(container, papers) {
  papers.forEach(function(pub) {
    var card = document.createElement("div");
    card.className = "pub-preview-card";

    var titleShort = pub.title.length > 90 ? pub.title.substring(0, 87) + "..." : pub.title;
    var linkUrl = pub.url || "#";
    var target = pub.url ? " target='_blank' rel='noopener'" : "";

    card.innerHTML =
      "<a href='" + linkUrl + "'" + target + ">" +
        "<img class='pub-thumb' src='" + pub.thumb + "' alt='" + titleShort + "' loading='lazy'>" +
      "</a>";

    container.appendChild(card);
  });
}

// === SELECTED PAPERS (curated favorites) ===
function renderSelectedPapers(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var selectedTitles = [
    "Don't Panic (Yet): Assessing the Evidence and Discourse Around Generative AI and Elections",
    "Misinformation on Misinformation: Conceptual and Methodological Challenges",
    "Spotting False News and Doubting True News: A Meta-Analysis of News Judgements",
    "News on Social Media Boosts Knowledge, Belief Accuracy, and Trust: A Field Experiment on Instagram and WhatsApp",
    "Misinformation Reloaded? Fears about the Impact of Generative AI on Misinformation are Overblown",
    "Research note: Fighting for information or fighting misinformation?",
    "Why do so Few People Share Fake News? It Hurts Their Reputation"
  ];

  var allPapers = SITE_DATA.peerReviewed.concat(SITE_DATA.chapters);
  var selected = selectedTitles.map(function(title) {
    return allPapers.find(function(p) { return p.title === title; });
  }).filter(function(p) { return p && p.thumb; });

  renderPubCards(container, selected);
}

// === PUBLICATION PREVIEW GRID (recent) ===
function renderPubPreviewGrid(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var allPapers = SITE_DATA.peerReviewed.concat(SITE_DATA.chapters);
  var papers = sortByYear(allPapers).filter(function(p) { return p.thumb; });

  renderPubCards(container, papers);
}

// === RENDER A FLAT LIST WITH "SHOW ALL" BUTTON ===
function renderFlatList(container, items, renderItemFn, previewCount) {
  if (!items || items.length === 0) return;

  var sorted = sortByYear(items);
  var preview = sorted.slice(0, previewCount);
  var rest = sorted.slice(previewCount);

  preview.forEach(function(item) {
    var el = document.createElement("div");
    el.className = "pub-entry";
    el.innerHTML = renderItemFn(item);
    container.appendChild(el);
  });

  if (rest.length > 0) {
    var hiddenId = uid();
    var hiddenDiv = document.createElement("div");
    hiddenDiv.id = hiddenId;
    hiddenDiv.style.display = "none";

    rest.forEach(function(item) {
      var el = document.createElement("div");
      el.className = "pub-entry";
      el.innerHTML = renderItemFn(item);
      hiddenDiv.appendChild(el);
    });

    container.appendChild(hiddenDiv);

    var btn = document.createElement("button");
    btn.className = "show-more-btn";
    btn.textContent = "Show all (" + rest.length + " more)";
    btn.onclick = function() { toggleShowMore(this, hiddenId); };
    container.appendChild(btn);
  }
}

// Same but using <li> elements
function renderFlatListUl(container, items, renderItemFn, previewCount) {
  if (!items || items.length === 0) return;

  var sorted = sortByYear(items);
  var preview = sorted.slice(0, previewCount);
  var rest = sorted.slice(previewCount);

  var ul = document.createElement("ul");
  ul.className = "entry-list";

  preview.forEach(function(item) {
    var li = document.createElement("li");
    li.innerHTML = renderItemFn(item);
    ul.appendChild(li);
  });

  container.appendChild(ul);

  if (rest.length > 0) {
    var hiddenId = uid();
    var hiddenUl = document.createElement("ul");
    hiddenUl.className = "entry-list";
    hiddenUl.id = hiddenId;
    hiddenUl.style.display = "none";

    rest.forEach(function(item) {
      var li = document.createElement("li");
      li.innerHTML = renderItemFn(item);
      hiddenUl.appendChild(li);
    });

    container.appendChild(hiddenUl);

    var btn = document.createElement("button");
    btn.className = "show-more-btn";
    btn.textContent = "Show all (" + rest.length + " more)";
    btn.onclick = function() { toggleShowMore(this, hiddenId); };
    container.appendChild(btn);
  }
}

// === PUBLICATION ITEM RENDERER ===
function pubToHtml(pub) {
  var html = "<span class='authors'>" + pub.authors + "</span> ";
  html += "(" + pub.year + ") ";
  html += "<span class='pub-title'>" + pub.title + ".</span> ";
  if (pub.url) {
    html += "<a href='" + pub.url + "' target='_blank' rel='noopener' class='journal-link'><span class='journal'>" + pub.journal + "</span></a>.";
  } else {
    html += "<span class='journal'>" + pub.journal + "</span>.";
  }
  if (pub.type) {
    html += " <span class='pub-type-tag'>" + pub.type + "</span>";
  }
  if (pub.youtube) {
    html += " <a href='" + pub.youtube + "' target='_blank' rel='noopener' class='pub-video-link'>&#9654; Video</a>";
  }
  return html;
}

// === PUBLICATIONS ===
function renderPublications(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var d = SITE_DATA;

  var note = document.createElement("p");
  note.style.fontSize = "13px";
  note.style.color = "var(--text-muted)";
  note.style.marginBottom = "16px";
  note.innerHTML = "\u2020 indicates equal contribution";
  container.appendChild(note);

  // Peer-reviewed: show 5
  var label1 = document.createElement("div");
  label1.className = "subsection-label";
  label1.textContent = "All Peer-Reviewed Articles";
  container.appendChild(label1);
  renderFlatList(container, d.peerReviewed, pubToHtml, 3);

  // Chapters: show 3
  if (d.chapters && d.chapters.length > 0) {
    var label2 = document.createElement("div");
    label2.className = "subsection-label";
    label2.textContent = "Book Chapters, Reports & Comments";
    container.appendChild(label2);
    renderFlatList(container, d.chapters, pubToHtml, 3);
  }

  // Working papers
  if (d.workingPapers && d.workingPapers.length > 0) {
    var label3 = document.createElement("div");
    label3.className = "subsection-label";
    label3.textContent = "Working Papers";
    container.appendChild(label3);
    renderFlatList(container, d.workingPapers, pubToHtml, 3);
  }
}

// === PRESENTATIONS ===
function renderPresentations(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  function talkToHtml(item) {
    var html = item.text + ". <span class='venue'>" + item.venue + "</span>";
    if (item.location) html += ", " + item.location;
    html += ".";
    if (item.type) html += " <span class='type-tag'>" + item.type + "</span>";
    html += " <span class='year-tag'>(" + item.year + ")</span>";
    return html;
  }

  var sections = [
    { label: "Conference & Workshop Presentations", data: SITE_DATA.conferences, preview: 3 },
    { label: "Invited Talks at International Conferences", data: SITE_DATA.invitedConferenceTalks, preview: 3 },
    { label: "Invited Lab Talks & Local Conferences", data: SITE_DATA.labTalks, preview: 3 }
  ];

  sections.forEach(function(section) {
    if (!section.data || section.data.length === 0) return;

    var label = document.createElement("div");
    label.className = "subsection-label";
    label.textContent = section.label;
    container.appendChild(label);

    renderFlatListUl(container, section.data, talkToHtml, section.preview);
  });
}

// === OUTREACH ===
function renderOutreach(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  // Public talks
  var label2 = document.createElement("div");
  label2.className = "subsection-label";
  label2.textContent = "Public Talks & Interventions";
  container.appendChild(label2);
  renderFlatListUl(container, SITE_DATA.publicTalks, function(item) {
    var html = "";
    if (item.url) {
      html += "<a href='" + item.url + "' target='_blank' rel='noopener'>" + item.text + "</a>";
    } else {
      html += item.text;
    }
    html += ". <span class='venue'>" + item.venue + "</span>.";
    html += " <span class='year-tag'>(" + item.year + ")</span>";
    return html;
  }, 3);

  // Articles
  var label3 = document.createElement("div");
  label3.className = "subsection-label";
  label3.textContent = "Articles & Reviews";
  container.appendChild(label3);
  renderFlatListUl(container, SITE_DATA.articles, function(item) {
    var html = "";
    if (item.url) {
      html += "<a href='" + item.url + "' target='_blank' rel='noopener'>" + item.title + "</a>";
    } else {
      html += item.title;
    }
    html += ". <span class='venue'>" + item.outlet + "</span>.";
    html += " <span class='year-tag'>(" + item.year + ")</span>";
    return html;
  }, 3);
}

// === TEACHING (collapsed by default) ===
function renderTeaching(containerId) {
  var container = document.getElementById(containerId);
  if (!container) return;

  var t = SITE_DATA.teaching;

  // Build all teaching content inside a hidden div
  var content = document.createElement("div");

  // Courses
  if (t.courses && t.courses.length > 0) {
    var label = document.createElement("div");
    label.className = "subsection-label";
    label.textContent = "Courses";
    content.appendChild(label);

    var ul = document.createElement("ul");
    ul.className = "entry-list";
    t.courses.forEach(function(c) {
      var li = document.createElement("li");
      li.innerHTML = "<span class='year-tag'>" + c.year + "</span> " +
        c.title + ". <span class='venue'>" + c.institution + "</span>, " + c.level +
        (c.coTeacher ? " (with " + c.coTeacher + ")" : "") +
        ". " + c.hours + ". <span class='type-tag'>" + c.role + "</span>";
      ul.appendChild(li);
    });
    content.appendChild(ul);
  }

  // TA
  if (t.ta && t.ta.length > 0) {
    var label2 = document.createElement("div");
    label2.className = "subsection-label";
    label2.textContent = "Teaching Assistant";
    content.appendChild(label2);

    var ul2 = document.createElement("ul");
    ul2.className = "entry-list";
    t.ta.forEach(function(c) {
      var li = document.createElement("li");
      li.innerHTML = "<span class='year-tag'>" + c.year + "</span> " +
        c.title + ". <span class='venue'>" + c.institution + "</span>, " + c.level + ". " + c.hours + ".";
      ul2.appendChild(li);
    });
    content.appendChild(ul2);
  }

  // Guest lectures
  if (t.guestLectures && t.guestLectures.length > 0) {
    var label3 = document.createElement("div");
    label3.className = "subsection-label";
    label3.textContent = "Guest Lectures (" + t.guestLectures.length + ")";
    content.appendChild(label3);

    var ul3 = document.createElement("ul");
    ul3.className = "entry-list";
    t.guestLectures.forEach(function(gl) {
      var li = document.createElement("li");
      li.innerHTML = "<span class='year-tag'>" + gl.year + "</span> " +
        gl.title + ". <span class='venue'>" + gl.institution + "</span>" +
        (gl.level ? ", " + gl.level : "") + ".";
      ul3.appendChild(li);
    });
    content.appendChild(ul3);
  }

  // Supervision
  if (t.supervision && t.supervision.length > 0) {
    var label4 = document.createElement("div");
    label4.className = "subsection-label";
    label4.textContent = "Student Supervision";
    content.appendChild(label4);

    var ul4 = document.createElement("ul");
    ul4.className = "entry-list";
    t.supervision.forEach(function(s) {
      var li = document.createElement("li");
      li.innerHTML = "<span class='year-tag'>" + s.years + "</span> " +
        s.student + " (" + s.institution + ")" +
        (s.note ? " \u2014 " + s.note : "") + ".";
      ul4.appendChild(li);
    });
    content.appendChild(ul4);
  }

  // Summary line + expand button
  var summary = document.createElement("p");
  summary.style.fontSize = "14px";
  summary.style.color = "var(--text-muted)";
  summary.style.marginBottom = "12px";
  var totalLectures = t.guestLectures ? t.guestLectures.length : 0;
  var totalStudents = t.supervision ? t.supervision.length : 0;
  summary.innerHTML = "Former co-instructor and TA at \u00c9cole Normale Sup\u00e9rieure. " +
    totalLectures + " guest lectures at international universities. " +
    totalStudents + " students supervised.";
  container.appendChild(summary);

  var hiddenId = uid();
  content.id = hiddenId;
  content.style.display = "none";
  container.appendChild(content);

  var btn = document.createElement("button");
  btn.className = "show-more-btn";
  btn.textContent = "Show details";
  btn.onclick = function() {
    var el = document.getElementById(hiddenId);
    if (el.style.display === "none") {
      el.style.display = "";
      btn.textContent = "Hide details";
    } else {
      el.style.display = "none";
      btn.textContent = "Show details";
    }
  };
  container.appendChild(btn);
}

// === NAVIGATION: highlight active section on scroll ===
function initScrollSpy() {
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll("nav a");

  function onScroll() {
    var current = "";
    sections.forEach(function(section) {
      var top = section.offsetTop - 40;
      if (window.scrollY >= top) {
        current = section.getAttribute("id");
      }
    });
    navLinks.forEach(function(link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// === INIT ===
document.addEventListener("DOMContentLoaded", function() {
  renderFeaturedTalks("featured-talks");
  renderPressCarousel(document.getElementById("press-carousel-standalone"));
  renderPodcastCarousel("podcast-carousel");
  renderSelectedPapers("selected-papers");
  renderPubPreviewGrid("pub-preview-grid");
  renderPublications("publications-content");
  renderPresentations("presentations-content");
  renderOutreach("outreach-content");
  renderTeaching("teaching-content");
  initScrollSpy();
});
