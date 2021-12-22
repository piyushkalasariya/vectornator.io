if (!window.location.pathname.includes("/faq")) {
  const searchTips = document.querySelector(".search-tips");
  searchTips.style.display = "none";
  const searchClient = algoliasearch(
    "3IX4R6F9TD",
    "4490249ded50f765cb1b2668f1a26519"
  );
  const search = instantsearch({
    indexName: "test_GLOBAL_SEARCH",
    searchClient,
    searchFunction(helper) {
      if (helper.state.query === "") {
        helper.state.hitsPerPage = 5;
        const facetFilters = [["tag:h1"]];
        helper.state.facetFilters = facetFilters;
      } else {
        helper.state.facetFilters = [];
        helper.state.hitsPerPage = 20;
      }
      helper.search();
    },
  });
  // Group results by distinct attribute (year) function
  function distinctResults(results, attributeForDistinct) {
    let d = {};
    for (const e of results)
      d[e[attributeForDistinct]] = [...(d[e[attributeForDistinct]] || []), e];
    return Object.entries(d).map(([k, v]) => ({ hits: v, categorie: k }));
  }
  // Create the render function
  const renderHits = (renderOptions, isFirstRender) => {
    const { hits, widgetParams } = renderOptions;
    if (renderOptions.results == undefined) {
      return;
    }
    const groupedByCategorie = distinctResults(hits, "categorie");
    widgetParams.container.innerHTML = `
  ${
    groupedByCategorie.length > 0
      ? `
  ${groupedByCategorie
    .map(
      (item) => `
  <div class="st-group">
  <div class="st-group-title is-light">
  <div class="subtitle-s">
  ${item.categorie}
  </div></div>
  ${item.hits
    .map((hit) => {
      let link = hit.h1Slug;
      let h1 = "";
      let h2 = "";
      let h3 = "";
      // console.log("render-hits-", hit);
      h1 = instantsearch.highlight({
        attribute: "h1",
        hit: hit,
        highlightedTagName: "strong",
      });
      if (hit.tag === "h1") {
        h1 = instantsearch.highlight({
          attribute: "name",
          hit: hit,
          highlightedTagName: "strong",
        });
      }
      if (hit.tag === "h2") {
        h2 = instantsearch.highlight({
          attribute: "name",
          hit: hit,
          highlightedTagName: "strong",
        });
        link += `#${hit.slug}`;
      }
      if (hit.tag === "h3") {
        h2 = instantsearch.highlight({
          attribute: "h2",
          hit: hit,
          highlightedTagName: "strong",
        });
        h3 = instantsearch.highlight({
          attribute: "name",
          hit: hit,
          highlightedTagName: "strong",
        });
        link += `#${hit.slug}`;
      }
      let heading = h1;
      const seperator = `<span style="color:grey;">></span>`;
      if (h2) {
        heading += ` ${seperator} ` + h2;
      }
      if (h3) {
        heading += ` ${seperator} ` + h3;
      }
      const SEARCH_LINK = `${window.location.origin}/${hit.objectID}`;
      // console.log("search-", {
      //   location: window.location,
      //   objectID: hit.objectID,
      //   SEARCH_LINK,
      // });
      return `
          <a href="${SEARCH_LINK}" class="st-link w-inline-block is-light">
            <div class="st-name">${heading}</div>
            <div class="st-text one-line">
              ${instantsearch.highlight({
                attribute: "text",
                hit: hit,
                highlightedTagName: "strong",
              })}
            </div>
          </a>
  `;
    })
    .join("")}
  </div>
  `
    )
    .join("")}
  `
      : `
  <div class="st-group"><div class="st-not-found is-light"><div class="st-name-title">No results found</div><div class="st-text">Make sure all word are spelled correctly.</div></div></div>
  `
  }
  `;
  };
  const customHits =
    instantsearch.connectors.connectHitsWithInsights(renderHits);
  search.addWidgets([
    instantsearch.widgets.configure({
      hitsPerPage: 5,
    }),
  ]);
  search.addWidgets([
    customHits({
      container: searchTips,
      transformItems: function (items) {
        return items.map((item) => ({
          ...item,
        }));
      },
    }),
  ]);
  search.addWidget(
    instantsearch.widgets.searchBox({
      container: ".sn-search",
      placeholder: "Search...",
      showReset: false,
      cssClasses: {
        root: "sn-search-box",
        form: ["sn-search-field", "w-form"],
        input: ["sn-search-input", "w-input", "searchfocus"],
        submit: ["search-button", "w-button"],
      },
    })
  );
  let searchInputIcon = document.querySelectorAll(".sn-search-box .svg")[0];
  let resetIcon = document.querySelectorAll(".sn-search-box .svg")[1];
  resetIcon.classList.add("reset");
  search.start();
  document.querySelector(".ais-SearchBox").prepend(searchInputIcon);
  document.querySelector(".ais-SearchBox").append(resetIcon);
  document.querySelector(".sn-search").append(searchTips);
  const container = document.querySelector(".search-tips");
  const inputSearch = document.querySelector(".searchfocus");
  const clearSearch = document.querySelector(".reset");
  const searchIcon = $(".sn-search-link");
  const searchBox = $(".sn-search-box");
  let areTipsOpen = false;
  const blurBackground = () =>
    $(".basic-container, .footer-box-light")
      .not(".sn-search-box, .sn-search-box *")
      .css({ filter: "blur(15px)", "z-index": "-1" });
  const unblurBackground = () =>
    $(".basic-container, .footer-box-light")
      .not(".sn-search-box, .sn-search-box *")
      .css({ filter: "", "z-index": "" });
  const showTips = () => $(container).slideDown(100).fadeTo(100, 1);
  const hideTips = () => $(container).slideUp(100).fadeTo(100, 0);
  const showBG = () => $(".sn-search-bg").fadeIn(100);
  const hideBG = () => $(".sn-search-bg").fadeOut(200);
  $(".sn-search-link").on("click", function (e) {
    searchBox.css("display", "flex");
    searchIcon.toggle();
    showBG();
    setTimeout(() => $("#search").focus(), 100);
  });
  $(".search-tips").mousedown(function (e) {
    e.preventDefault();
    $(e.target.closest("a")).trigger("click");
    if (e.target.closest("a")) {
      id = e.target.closest("a").getAttribute("href");
      if ($(id + " .help-faq-droplist").css("height") === "0px") {
        $(id + " .help-faq-toggle").trigger("click");
      }
    }
  });
  inputSearch.addEventListener("focusout", function () {
    if (areTipsOpen) {
      // const keyword = $("#search").val();
      hideBG();
      unblurBackground();
      hideTips();
      searchIcon.toggle();
      searchBox.css("display", "none");
      areTipsOpen = false;
      // if (keyword) window.open(`/searching?query=${keyword}`, "_self");
    }
  });
  inputSearch.addEventListener("focus", function () {
    if (!areTipsOpen) {
      blurBackground();
      showTips();
      areTipsOpen = true;
    } else {
      areTipsOpen = false;
    }
  });
  clearSearch.addEventListener("mousedown", function (e) {
    e.preventDefault();
    inputSearch.parentNode.reset();
    inputSearch.blur();
  });
}
