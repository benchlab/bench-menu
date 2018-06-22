'use strict';

/**
 * Setup namespace
 */
if (typeof bench === 'undefined') {
  var bench = {};
}

if (bench.hasOwnProperty('benchMenu')) {
  throw TypeError("Namespace 'bench' not available");
}

bench.benchMenu = function () {
  // Helpers & polyfills
  var createFromHTML = function createFromHTML(html) {
    var div = document.createElement('div');
    div.innerHTML = html;
    return div.childNodes[0];
  };

  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }

  return {
    sites: [{ url: "http://dtunes.io", title: "dTunes" }, { url: "http://dstatus.io", title: "dStatus" }, { url: "http://benchx.io/dan", title: "DAN" }, { url: "http://dvid.io", title: "dVids" }, { url: "http://dsell.io", title: "dSell" }, { url: "http://dnames.io", title: "dNames" }, { url: "http://dHost.io", title: "dHost" }, { url: "http://legal.benchx.io", title: "Legal" }, { url: "http://partners.benchx.io", title: "Partners" }, { url: "http://benchx.io/about", title: "About Bench" }, { url: "http://community.benchx.io", title: "Community" }, { url: "http://developers.benchx.io/", title: "Developers" }],

    more: [{ url: "http://benchx.io/support", title: "Support" }, { url: "http://open.benchx.io", title: "Downloads" }, { url: "http://wallet.benchcore.io", title: "BenchWallet" }, { url: "http://shop.benchx.io", title: "Shop" }, { url: "http://foundation.benchx.io", title: "Foundation" }, { url: "http://distributedwebs.org", title: "DW Project" }],

    setup: function setup() {
      var benchMenu = this.createNav();

      this.addNav(benchMenu);
      this.trackClicks(benchMenu);

      return benchMenu;
    },

    createItem: function createItem(site) {
      var last = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var siteItem = document.createElement('li');
      var siteLink = document.createElement('a');

      siteLink.href = site.url;
      siteLink.classList.add('benchmenu__link');
      siteLink.innerText = site.title;

      if (document.URL.startsWith(site.url)) {
        siteLink.classList.add('is-active');
      }

      siteItem.classList.add('benchmenu__list-item');
      if (last) {
        siteItem.id = 'bench-menu';
      }
      siteItem.appendChild(siteLink);
      return siteItem;
    },

    createNav: function createNav() {
      var wrapper = createFromHTML('<nav class="benchmenu">' + '  <div class="benchmenu__wrapper">' + '    <button class="benchmenu__title" aria-expanded="false" aria-controls="benchnavigation">' + '      Ubuntu websites' + '    </button>' + '    <ul class="benchmenu__list" id="benchnavigation" aria-hidden="true">' + '      ' + '    </ul>' + '  </div>' + '</nav>');

      var navList = wrapper.querySelector('ul');

      // Add all top sites
      this.sites.forEach(function (obj) {
        return function (site) {
          navList.appendChild(obj.createItem(site));
        };
      }(this));

      // Add "more" sites
      if (this.more.length > 0) {
        var moreItem = createFromHTML('<li class="benchmenu__list-item--more">' + '  <a class="benchmenu__link" href="#">' + '    More <span class="benchmenu__more-chevron">&rsaquo;</span>' + '  </a>' + '  <ul class="benchmenu__more"></ul>' + '</li>');
        var moreList = moreItem.querySelector('ul');

        this.more.forEach(function (obj) {
          return function (moreSite, index, more) {
            if (index === more.length - 1) {
              moreList.appendChild(obj.createItem(moreSite, true));
            } else {
              moreList.appendChild(obj.createItem(moreSite));
            }
          };
        }(this));

        navList.appendChild(moreItem);
      }

      return wrapper;
    },

    addNav: function addNav(benchMenu) {
      document.body.insertBefore(benchMenu, document.body.firstElementChild);

      var moreList = benchMenu.querySelector('.benchmenu__list-item--more');
      var moreToggle = benchMenu.querySelector('.benchmenu__list-item--more > .benchmenu__link');

      if (moreList) {
        /* Open and close the menu on click of heading */
        moreToggle.addEventListener('click', function (moreList) {
          return function (clickEvent) {
            moreList.classList.toggle('is-revealed');
          };
        }(moreList));
        /* Close the menu on click elsewhere */
        document.addEventListener('click', function (moreList) {
          return function (clickEvent) {
            if (!(moreList.contains(clickEvent.target) || moreList == clickEvent.target)) {
              moreList.classList.remove('is-revealed');
            }
          };
        }(moreList));
      }

      var smallScreenToggle = benchMenu.querySelector('.benchmenu__title');
      var navList = benchMenu.querySelector('.benchmenu__list');
      if (smallScreenToggle && navList) {
        smallScreenToggle.addEventListener('click', function (smallScreenToggle) {
          return function (clickEvent) {
            smallScreenToggle.classList.toggle('is-revealed');
            navList.classList.toggle('is-revealed');
            var expand = smallScreenToggle.getAttribute('aria-expanded') == 'true';
            smallScreenToggle.setAttribute('aria-expanded', !expand);
            navList.setAttribute('aria-hidden', expand);
            if (expand) {
              window.location.hash = 'benchmenu';
            } else {
              window.location.hash = 'bench-menu';
            }
          };
        }(smallScreenToggle));
      }
    },
    trackClicks: function trackClicks(navGlobal) {
      navGlobal.querySelector('a').addEventListener('click', function (clickEvent) {
        clickEvent.preventDefault();

        try {
          _gaq.push(['_trackEvent', 'Global bar click', clickEvent.target.get('text')]);
        } catch (err) {}

        setTimeout(function () {
          document.location.href = clickEvent.target.getAttribute('href');
        }, 100);
      });
    }
  };
}();
