/**
 * Setup namespace
 */
if (typeof bench === 'undefined') {
  var bench = {};
}

if (bench.hasOwnProperty('globalNav')) {
  throw TypeError("Namespace 'bench' not available");
}

bench.globalNav = function() {
  // Helpers & polyfills
  const createFromHTML = function(html) {
    let div = document.createElement('div');
    div.innerHTML = html;
    return div.childNodes[0];
  };

  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
    };
  }

  return {
    sites: [
      { url: "http://dtunes.io", title: "dTunes" },
      { url: "http://dstatus.io", title: "dStatus" },
      { url: "http://benchx.io/dan", title: "DAN" },
      { url: "http://dvid.io", title: "dVids" },
      { url: "http://dsell.io", title: "dSell" },
      { url: "http://dnames.io", title: "dNames" },
      { url: "http://dHost.io", title: "dHost" },
      { url: "http://legal.benchx.io", title: "Legal" },
      { url: "http://partners.benchx.io", title: "Partners" },
      { url: "http://benchx.io/about", title: "About Bench" },
      { url: "http://community.benchx.io", title: "Community" },
      { url: "http://developers.benchx.io/", title: "Developers" }
    ],

    more: [
      { url: "http://benchx.io/support", title: "Support" },
      { url: "http://open.benchx.io", title: "Downloads" },
      { url: "http://wallet.benchcore.io", title: "BenchWallet" },
      { url: "http://shop.benchx.io", title: "Shop" },
      { url: "http://foundation.benchx.io", title: "Foundation" },
      { url: "http://distributedwebs.org", title: "DW Project" }
    ],

    setup: function () {
      let globalNav = this.createNav();

      this.addNav(globalNav);
      this.trackClicks(globalNav);

      return globalNav;
    },

    createItem: function (site, last = false) {
      let siteItem = document.createElement('li');
      let siteLink = document.createElement('a');

      siteLink.href = site.url;
      siteLink.classList.add('global-nav__link');
      siteLink.innerText = site.title;

      if (document.URL.startsWith(site.url)) {
        siteLink.classList.add('is-active');
      }

      siteItem.classList.add('global-nav__list-item');
      if (last) {
        siteItem.id = 'global-nav-menu';
      }
      siteItem.appendChild(siteLink);
      return siteItem;
    },

    createNav: function() {
      let wrapper = createFromHTML(
        '<nav class="global-nav">' +
        '  <div class="global-nav__wrapper">' +
        '    <button class="global-nav__title" aria-expanded="false" aria-controls="global-navigation">' +
        '      Ubuntu websites' +
        '    </button>' +
        '    <ul class="global-nav__list" id="global-navigation" aria-hidden="true">' +
        '      ' +
        '    </ul>' +
        '  </div>' +
        '</nav>'
      );

      let navList = wrapper.querySelector('ul');

      // Add all top sites
      this.sites.forEach(
        function(obj) {
          return function (site) {
            navList.appendChild(obj.createItem(site));
          };
        }(this)
      );

      // Add "more" sites
      if (this.more.length > 0) {
        let moreItem = createFromHTML(
          '<li class="global-nav__list-item--more">' +
          '  <a class="global-nav__link" href="#">' +
          '    More <span class="global-nav__more-chevron">&rsaquo;</span>' +
          '  </a>' +
          '  <ul class="global-nav__more"></ul>' +
          '</li>'
        );
        let moreList = moreItem.querySelector('ul');

        this.more.forEach(
          function (obj) {
            return function(moreSite, index, more) {
              if (index === more.length - 1){
                moreList.appendChild(obj.createItem(moreSite, true));
              } else {
                moreList.appendChild(obj.createItem(moreSite));
              }
            };
          }(this)
        );

        navList.appendChild(moreItem);
      }

      return wrapper;
    },

    addNav: function(globalNav) {
      document.body.insertBefore(
        globalNav,
        document.body.firstElementChild
      );

      let moreList = globalNav.querySelector('.global-nav__list-item--more');
      let moreToggle = globalNav.querySelector('.global-nav__list-item--more > .global-nav__link');

      if (moreList) {
        /* Open and close the menu on click of heading */
        moreToggle.addEventListener(
          'click',
          function(moreList) {
            return function(clickEvent) {
              moreList.classList.toggle('is-revealed');
            };
          }(moreList)
        );
        /* Close the menu on click elsewhere */
        document.addEventListener(
          'click',
          function (moreList) {
            return function(clickEvent) {
              if (
                ! (
                  moreList.contains(clickEvent.target) ||
                  moreList == clickEvent.target)
              ) {
                moreList.classList.remove('is-revealed');
              }
            };
          }(moreList)
        );
      }

      let smallScreenToggle = globalNav.querySelector('.global-nav__title');
      let navList = globalNav.querySelector('.global-nav__list');
      if (smallScreenToggle && navList) {
        smallScreenToggle.addEventListener(
          'click',
          function(smallScreenToggle) {
            return function(clickEvent) {
              smallScreenToggle.classList.toggle('is-revealed');
              navList.classList.toggle('is-revealed');
              var expand = (smallScreenToggle.getAttribute('aria-expanded') == 'true');
              smallScreenToggle.setAttribute('aria-expanded', !expand);
              navList.setAttribute('aria-hidden', expand);
              if (expand) {
                window.location.hash = 'global-nav';
              } else {
                window.location.hash = 'global-nav-menu';
              }
            };
          }(smallScreenToggle)
        );
      }
    },
    trackClicks: function(navGlobal) {
      navGlobal.querySelector('a').addEventListener(
        'click',
        function(clickEvent) {
          clickEvent.preventDefault();

          try {
            _gaq.push([
              '_trackEvent',
              'Global bar click',
              clickEvent.target.get('text')
            ]);
          } catch(err) {}

          setTimeout(
            function() {
              document.location.href = clickEvent.target.getAttribute('href');
            },
            100
          );
        }
      );
    }
  };
}();
