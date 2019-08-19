<!DOCTYPE html><html lang="en">
  <head><meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no"><title>PEML</title>

<meta name="description" content="The Programming Exercise Markup Language (PEML) is designed to provide an ultra-human-friendly authoring format for describing automatically graded programmi...">
<link rel="canonical" href="http://localhost:4000/peml/assets/search.js"><link rel="alternate" type="application/rss+xml" title="PEML" href="/peml/feed.xml">
<!-- begin favicon --><link rel="apple-touch-icon" sizes="180x180" href="/peml/assets/apple-touch-icon.png"><link rel="icon" type="image/png" sizes="32x32" href="/peml/assets/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="/peml/assets/favicon-16x16.png"><link rel="manifest" href="/peml/assets/site.webmanifest"><link rel="mask-icon" href="/peml/assets/safari-pinned-tab.svg" color="#fc4d50"><link rel="shortcut icon" href="/peml/assets/favicon.ico">

<meta name="msapplication-TileColor" content="#ffc40d"><meta name="msapplication-config" content="/peml/assets/browserconfig.xml">

<meta name="theme-color" content="#ffffff">
<!-- end favicon --><link rel="stylesheet" href="/peml/assets/css/main.css"><link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" >
<script>(function() {
  window.isArray = function(val) {
    return Object.prototype.toString.call(val) === '[object Array]';
  };
  window.isString = function(val) {
    return typeof val === 'string';
  };

  window.decodeUrl = function(str) {
    return str ? decodeURIComponent(str.replace(/\+/g, '%20')) : '';
  };

  window.hasEvent = function(event) {
    return 'on'.concat(event) in window.document;
  };

  window.isOverallScroller = function(node) {
    return node === document.documentElement || node === document.body || node === window;
  };

  window.isFormElement = function(node) {
    var tagName = node.tagName;
    return tagName === 'INPUT' || tagName === 'SELECT' || tagName === 'TEXTAREA';
  };

  window.pageLoad = (function () {
    var loaded = false, cbs = [];
    window.addEventListener('load', function () {
      var i;
      loaded = true;
      if (cbs.length > 0) {
        for (i = 0; i < cbs.length; i++) {
          cbs[i]();
        }
      }
    });
    return {
      then: function(cb) {
        cb && (loaded ? cb() : (cbs.push(cb)));
      }
    };
  })();
})();(function() {
  window.throttle = function(func, wait) {
    var args, result, thisArg, timeoutId, lastCalled = 0;

    function trailingCall() {
      lastCalled = new Date;
      timeoutId = null;
      result = func.apply(thisArg, args);
    }
    return function() {
      var now = new Date,
        remaining = wait - (now - lastCalled);

      args = arguments;
      thisArg = this;

      if (remaining <= 0) {
        clearTimeout(timeoutId);
        timeoutId = null;
        lastCalled = now;
        result = func.apply(thisArg, args);
      } else if (!timeoutId) {
        timeoutId = setTimeout(trailingCall, remaining);
      }
      return result;
    };
  };
})();(function() {
  var Set = (function() {
    var add = function(item) {
      var i, data = this._data;
      for (i = 0; i < data.length; i++) {
        if (data[i] === item) {
          return;
        }
      }
      this.size ++;
      data.push(item);
      return data;
    };

    var Set = function(data) {
      this.size = 0;
      this._data = [];
      var i;
      if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
          add.call(this, data[i]);
        }
      }
    };
    Set.prototype.add = add;
    Set.prototype.get = function(index) { return this._data[index]; };
    Set.prototype.has = function(item) {
      var i, data = this._data;
      for (i = 0; i < data.length; i++) {
        if (this.get(i) === item) {
          return true;
        }
      }
      return false;
    };
    Set.prototype.is = function(map) {
      if (map._data.length !== this._data.length) { return false; }
      var i, j, flag, tData = this._data, mData = map._data;
      for (i = 0; i < tData.length; i++) {
        for (flag = false, j = 0; j < mData.length; j++) {
          if (tData[i] === mData[j]) {
            flag = true;
            break;
          }
        }
        if (!flag) { return false; }
      }
      return true;
    };
    Set.prototype.values = function() {
      return this._data;
    };
    return Set;
  })();

  window.Lazyload = (function(doc) {
    var queue = {js: [], css: []}, sources = {js: {}, css: {}}, context = this;
    var createNode = function(name, attrs) {
      var node = doc.createElement(name), attr;
      for (attr in attrs) {
        if (attrs.hasOwnProperty(attr)) {
          node.setAttribute(attr, attrs[attr]);
        }
      }
      return node;
    };
    var end = function(type, url) {
      var s, q, qi, cbs, i, j, cur, val, flag;
      if (type === 'js' || type ==='css') {
        s = sources[type], q = queue[type];
        s[url] = true;
        for (i = 0; i < q.length; i++) {
          cur = q[i];
          if (cur.urls.has(url)) {
            qi = cur, val = qi.urls.values();
            qi && (cbs = qi.callbacks);
            for (flag = true, j = 0; j < val.length; j++) {
              cur = val[j];
              if (!s[cur]) {
                flag = false;
              }
            }
            if (flag && cbs && cbs.length > 0) {
              for (j = 0; j < cbs.length; j++) {
                cbs[j].call(context);
              }
              qi.load = true;
            }
          }
        }
      }
    };
    var load = function(type, urls, callback) {
      var s, q, qi, node, i, cur,
        _urls = typeof urls === 'string' ? new Set([urls]) : new Set(urls), val, url;
      if (type === 'js' || type ==='css') {
        s = sources[type], q = queue[type];
        for (i = 0; i < q.length; i++) {
          cur = q[i];
          if (_urls.is(cur.urls)) {
            qi = cur;
            break;
          }
        }
        val = _urls.values();
        if (qi) {
          callback && (qi.load || qi.callbacks.push(callback));
          callback && (qi.load && callback());
        } else {
          q.push({
            urls: _urls,
            callbacks: callback ? [callback] : [],
            load: false
          });
          for (i = 0; i < val.length; i++) {
            node = null, url = val[i];
            if (s[url] === undefined) {
              (type === 'js' ) && (node = createNode('script', { src: url }));
              (type === 'css') && (node = createNode('link', { rel: 'stylesheet', href: url }));
              if (node) {
                node.onload = (function(type, url) {
                  return function() {
                    end(type, url);
                  };
                })(type, url);
                (doc.head || doc.body).appendChild(node);
                s[url] = false;
              }
            }
          }
        }
      }
    };
    return {
      js: function(url, callback) {
        load('js', url, callback);
      },
      css: function(url, callback) {
        load('css', url, callback);
      }
    };
  })(this.document);
})();</script><script>
  (function() {
    var TEXT_VARIABLES = {
      version: '2.2.4',
      sources: {
        font_awesome: 'https://use.fontawesome.com/releases/v5.0.13/css/all.css',
        jquery: 'https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js',
        leancloud_js_sdk: '//cdn1.lncld.net/static/js/3.4.1/av-min.js',
        chart: 'https://cdn.bootcss.com/Chart.js/2.7.2/Chart.bundle.min.js',
        gitalk: {
          js: 'https://cdn.bootcss.com/gitalk/1.2.2/gitalk.min.js',
          css: 'https://cdn.bootcss.com/gitalk/1.2.2/gitalk.min.css'
        },
        valine: 'https://unpkg.com/valine/dist/Valine.min.js',
        mathjax: 'https://cdn.bootcss.com/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML',
        mermaid: 'https://cdn.bootcss.com/mermaid/8.0.0-rc.8/mermaid.min.js'
      },
      site: {
        toc: {
          selectors: 'h2,h3,h4'
        }
      },
      paths: {
        search_js: '/peml/assets/search.js'
      }
    };
    window.TEXT_VARIABLES = TEXT_VARIABLES;
  })();
</script></head>
  <body>
    <div class="root" data-is-touch="false">
      <div class="layout--page js-page-root"><div class="page__main js-page-main page__viewport has-aside cell cell--auto">

      <div class="page__main-inner">
        <div></div><div class="page__header d-print-none"><header class="header"><div class="main">
      <div class="header__title">
        <div class="header__brand"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="24px" height="24px" viewBox="0 0 24 24">
<style type="text/css">
	.st0{fill:#515151;}
</style>
<path class="st0" d="M1.7,22.3c5.7-5.7,11.3-5.7,17,0c3.3-3.3,3.5-5.3,0.8-6c2.7,0.7,3.5-1.1,2.3-5.6s-3.3-5.2-6.3-2.1
	c3-3,2.3-5.2-2.1-6.3S7,1.8,7.7,4.6C7,1.8,5,2.1,1.7,5.3C7.3,11,7.3,16.7,1.7,22.3"/>
</svg><a title="The Programming Exercise Markup Language (PEML) is designed to provide an ultra-human-friendly authoring format for describing automatically graded programming assignments.
" href="/peml/">PEML</a></div>
        <button class="button button--secondary button--circle search-button js-search-toggle"><i class="fas fa-search"></i></button>
      </div><nav class="navigation">
        <ul><li class="navigation__link"><a href="/peml/">Introduction</a></li><li class="navigation__link"><a href="/peml/schemas/">Data Model</a></li><li class="navigation__link"><a href="/peml/PEMLtest/">PEMLtest</a></li><li class="navigation__link"><a href="/peml/examples/">Examples</a></li><li class="navigation__link"><a href="https://github.com/CSSPLICE/peml/">Software</a></li><li class="navigation__link"><a href="https://github.com/CSSPLICE/CSSPLICE.github.io/tree/master/peml/">GitHub</a></li><li class="navigation__link"><a href="https://cssplice.github.io/">SPLICE</a></li><li><button class="button button--secondary button--circle search-button js-search-toggle"><i class="fas fa-search"></i></button></li>
        </ul>
      </nav></div>
  </header>
</div><div class="page__content"><div class="article__header--overlay"><div class="hero hero--center hero--dark overlay" style="background-image:;background-color:#007bff;"><div class="hero__content"><div class="article__header"><header><h1></h1></header><span class="split-space">&nbsp;</span>
          <a class="edit-on-github"
            title=""
            href="https://github.com/cssplice/cssplice.github.io/tree/master/peml/assets/search.js">
            <i class="far fa-edit"></i></a></div><p class="overlay__excerpt">The Programming Exercise Markup Language (PEML) is designed to provide an ultra-human-friendly authoring format for describing automatically graded programming assignments.</p></div>
              </div>
            </div><div class="grid grid--reverse">

              <div class="col-aside d-print-none js-col-aside"><aside class="page__aside js-page-aside"><div class="toc-aside js-toc-root"></div></aside></div>

              <div class="col-main cell cell--auto"><article itemscope itemtype="http://schema.org/Article"><meta itemprop="headline" content=""><meta itemprop="author" content="Virginia Tech"/><div class="js-article-content"><div class="layout--article">

  <div class="article__content" itemprop="articleBody">window.TEXT_SEARCH_DATA={'posts':[]};</div><footer class="article__footer"><!-- this will show at every article content's bottom --><div class="article__license"><div class="license">
    <p>
      <a rel="license" href="https://creativecommons.org/licenses/by-sa/4.0/">
        <img alt="Attribution-ShareAlike 4.0 International" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" />
      </a>
    </p>
  </div></div></footer>

  <div class="d-print-none"></div>

</div>

<script>(function() {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    $(function() {
      var $this ,$scroll;
      var $articleContent = $('.js-article-content');
      var hasSidebar = $('.js-page-root').hasClass('layout--page--sidebar');
      var scroll = hasSidebar ? '.js-page-main' : 'html, body';
      $scroll = $(scroll);

      $articleContent.find('.highlight').each(function() {
        $this = $(this);
        $this.attr('data-lang', $this.find('code').attr('data-lang'));
      });
      $articleContent.find('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]').each(function() {
        $this = $(this);
        $this.append($('<a class="anchor d-print-none" aria-hidden="true"></a>').html('<i class="fas fa-anchor"></i>'));
      });
      $articleContent.on('click', '.anchor', function() {
        $scroll.scrollToAnchor('#' + $(this).parent().attr('id'), 400);
      });
    });
  });
})();</script></div><section class="page__comments d-print-none"></section></article>
              </div>
            </div></div><div class="page__footer d-print-none">
<div class="footer js-page-footer">
  <div class="main"><aside  itemscope itemtype="http://schema.org/Organization">
      <meta itemprop="name" content="Virginia Tech"><meta itemprop="url" content="http://www.cs.vt.edu/"><meta itemprop="description" content="PEML, Web-CAT, and related projects are academic research projects developed at Virginia Tech. The project lead is Stephen Edwards.
"><div class="footer__author-links"><div class="author-links">
  <ul class="menu menu--nowrap menu--inline"><link itemprop="url" href="http://www.cs.vt.edu/"><li title="">
      <a class="button button--circle mail-button" itemprop="email" href="mailto:webcat@vt.edu" target="_blank">
        <i class="fas fa-envelope"></i>
      </a><li title="">
        <a class="button button--circle github-button" itemprop="sameAs" href="https://github.com/CSSPLICE" target="_blank">
          <div class="icon"><svg fill="#000000" width="24px" height="24px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <path class="svgpath" data-index="path_0" fill="#272636" d="M0 525.2c0 223.6 143.3 413.7 343 483.5 26.9 6.8 22.8-12.4 22.8-25.4l0-88.7c-155.3 18.2-161.5-84.6-172-101.7-21.1-36-70.8-45.2-56-62.3 35.4-18.2 71.4 4.6 113.1 66.3 30.2 44.7 89.1 37.2 119 29.7 6.5-26.9 20.5-50.9 39.7-69.6C248.8 728.2 181.7 630 181.7 513.2c0-56.6 18.7-108.7 55.3-150.7-23.3-69.3 2.2-128.5 5.6-137.3 66.5-6 135.5 47.6 140.9 51.8 37.8-10.2 80.9-15.6 129.1-15.6 48.5 0 91.8 5.6 129.8 15.9 12.9-9.8 77-55.8 138.8-50.2 3.3 8.8 28.2 66.7 6.3 135 37.1 42.1 56 94.6 56 151.4 0 117-67.5 215.3-228.8 243.7 26.9 26.6 43.6 63.4 43.6 104.2l0 128.8c0.9 10.3 0 20.5 17.2 20.5C878.1 942.4 1024 750.9 1024 525.3c0-282.9-229.3-512-512-512C229.1 13.2 0 242.3 0 525.2L0 525.2z" />
</svg>
</div>
        </a>
      </li></ul>
</div>
</div>
    </aside>
    <footer class="site-info"><p class="menu menu--center">
        <span>© PEML </span>
        <a type="application/rss+xml" href="/peml/feed.xml"></a>
      </p>
      <p>Powered by <a title="Jekyll is a simple, blog-aware, static site generator." href="http://jekyllrb.com/">Jekyll</a> & <a
        title="TeXt is a succinct theme for blogging." href="https://github.com/kitian616/jekyll-TeXt-theme">TeXt Theme</a>.
      </p>
    </footer>
  </div>
</div></div></div>
    </div><div class="modal modal--overflow page__search-modal d-print-none js-page-search-modal"><div class="search search--dark">
  <div class="main">
    <div class="search__header"></div>
    <div class="search-bar">
      <div class="search-box js-search-box">
        <div class="search-box__icon-search"><i class="fas fa-search"></i></div>
        <input type="text" />
        <div class="search-box__icon-clear js-icon-clear">
          <a><i class="fas fa-times"></i></a>
        </div>
      </div>
      <button class="button button--theme-dark button--pill search__cancel js-search-toggle">
        </button>
    </div>
    <div class="search-result js-search-result"></div>
  </div>
</div></div></div>


<script>(function() {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    function scrollToAnchor(anchor, duration, callback) {
      var $root = this;
      $root.animate({ scrollTop: $(anchor).position().top }, duration, function() {
        window.history.replaceState(null, '', window.location.href.split('#')[0] + anchor);
        callback && callback();
      });
    }
    $.fn.scrollToAnchor = scrollToAnchor;
  });
})();(function() {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    function affix(options) {
      var $root = this, $window = $(window), $scrollTarget, $scroll,
        offsetBottom = 0, scrollTarget = window, scroll = window.document, disabled = false, isOverallScroller = true,
        rootTop, rootLeft, rootHeight, scrollBottom, rootBottomTop,
        hasInit = false, curState;

      function setOptions(options) {
        var _options = options || {};
        _options.offsetBottom && (offsetBottom = _options.offsetBottom);
        _options.scrollTarget && (scrollTarget = _options.scrollTarget);
        _options.scroll && (scroll = _options.scroll);
        _options.disabled !== undefined && (disabled = _options.disabled);
        $scrollTarget = $(scrollTarget);
        isOverallScroller = window.isOverallScroller($scrollTarget[0]);
        $scroll = $(scroll);
      }
      function preCalc() {
        top();
        rootHeight = $root.outerHeight();
        rootTop = $root.offset().top + (isOverallScroller ? 0 :  $scrollTarget.scrollTop());
        rootLeft = $root.offset().left;
      }
      function calc(needPreCalc) {
        needPreCalc && preCalc();
        scrollBottom = $scroll.outerHeight() - offsetBottom - rootHeight;
        rootBottomTop = scrollBottom - rootTop;
      }
      function top() {
        if (curState !== 'top') {
          $root.removeClass('fixed').css({
            left: 0,
            top: 0
          });
          curState = 'top';
        }
      }
      function fixed() {
        if (curState !== 'fixed') {
          $root.addClass('fixed').css({
            left: rootLeft + 'px',
            top: 0
          });
          curState = 'fixed';
        }
      }
      function bottom() {
        if (curState !== 'bottom') {
          $root.removeClass('fixed').css({
            left: 0,
            top: rootBottomTop + 'px'
          });
          curState = 'bottom';
        }
      }
      function setState() {
        var scrollTop = $scrollTarget.scrollTop();
        if (scrollTop >= rootTop && scrollTop <= scrollBottom) {
          fixed();
        } else if (scrollTop < rootTop) {
          top();
        } else {
          bottom();
        }
      }
      function init() {
        if(!hasInit) {
          var interval, timeout;
          calc(true); setState();
          // run calc every 100 millisecond
          interval = setInterval(function() {
            calc();
          }, 100);
          timeout = setTimeout(function() {
            clearInterval(interval);
          }, 45000);
          window.pageLoad.then(function() {
            setTimeout(function() {
              clearInterval(interval);
              clearTimeout(timeout);
            }, 3000);
          });
          $scrollTarget.on('scroll', function() {
            disabled || setState();
          });
          $window.on('resize', function() {
            disabled || (calc(true), setState());
          });
          hasInit = true;
        }
      }

      setOptions(options);
      if (!disabled) {
        init();
      }
      $window.on('resize', window.throttle(function() {
        init();
      }, 200));
      return {
        setOptions: setOptions,
        refresh: function() {
          calc(true, { animation: false }); setState();
        }
      };
    }
    $.fn.affix = affix;
  });
})();(function() {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    function toc(options) {
      var $root = this, $window = $(window), $scrollTarget, $scroller, $tocUl = $('<ul class="toc toc--ellipsis"></ul>'), $tocLi, $headings, $activeLast, $activeCur,
        selectors = 'h1,h2,h3', container = 'body', scrollTarget = window, scroller = 'html, body', disabled = false,
        headingsPos, scrolling = false, hasRendered = false, hasInit = false;

      function setOptions(options) {
        var _options = options || {};
        _options.selectors && (selectors = _options.selectors);
        _options.container && (container = _options.container);
        _options.scrollTarget && (scrollTarget = _options.scrollTarget);
        _options.scroller && (scroller = _options.scroller);
        _options.disabled !== undefined && (disabled = _options.disabled);
        $headings = $(container).find(selectors).filter('[id]');
        $scrollTarget = $(scrollTarget);
        $scroller = $(scroller);
      }
      function calc() {
        headingsPos = [];
        $headings.each(function() {
          headingsPos.push(Math.floor($(this).position().top));
        });
      }
      function setState(element, disabled) {
        var scrollTop = $scrollTarget.scrollTop(), i;
        if (disabled || !headingsPos || headingsPos.length < 1) { return; }
        if (element) {
          $activeCur = element;
        } else {
          for (i = 0; i < headingsPos.length; i++) {
            if (scrollTop >= headingsPos[i]) {
              $activeCur = $tocLi.eq(i);
            } else {
              $activeCur || ($activeCur = $tocLi.eq(i));
              break;
            }
          }
        }
        $activeLast && $activeLast.removeClass('active');
        ($activeLast = $activeCur).addClass('active');
      }
      function render() {
        if(!hasRendered) {
          $root.append($tocUl);
          $headings.each(function() {
            var $this = $(this);
            $tocUl.append($('<li></li>').addClass('toc-' + $this.prop('tagName').toLowerCase())
              .append($('<a></a>').html($this.html()).attr('href', '#' + $this.prop('id'))));
          });
          $tocLi = $tocUl.children('li');
          $tocUl.on('click', 'a', function(e) {
            e.preventDefault();
            var $this = $(this);
            scrolling = true;
            setState($this.parent());
            $scroller.scrollToAnchor($this.attr('href'), 400, function() {
              scrolling = false;
            });
          });
        }
        hasRendered = true;
      }
      function init() {
        var interval, timeout;
        if(!hasInit) {
          render(); calc(); setState(null, scrolling);
          // run calc every 100 millisecond
          interval = setInterval(function() {
            calc();
          }, 100);
          timeout = setTimeout(function() {
            clearInterval(interval);
          }, 45000);
          window.pageLoad.then(function() {
            setTimeout(function() {
              clearInterval(interval);
              clearTimeout(timeout);
            }, 3000);
          });
          $scrollTarget.on('scroll', function() {
            disabled || setState(null, scrolling);
          });
          $window.on('resize', window.throttle(function() {
            if (!disabled) {
              render(); calc(); setState(null, scrolling);
            }
          }, 100));
        }
        hasInit = true;
      }

      setOptions(options);
      if (!disabled) {
        init();
      }
      $window.on('resize', window.throttle(function() {
        init();
      }, 200));
      return {
        setOptions: setOptions
      };
    }
    $.fn.toc = toc;
  });
})();(function() {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    var $body = $('body'), $window = $(window);
    var $pageRoot = $('.js-page-root'), $pageMain = $('.js-page-main');
    var activeCount = 0;
    function modal(options) {
      var $root = this, visible, onChange;
      var scrollTop;
      function setOptions(options) {
        var _options = options || {};
        visible = _options.initialVisible === undefined ? false : show;
        onChange = _options.onChange;
      }
      function init() {
        setState(visible);
      }
      function setState(isShow) {
        if (isShow === visible) {
          return;
        }
        visible = isShow;
        if (visible) {
          activeCount ++;
          scrollTop = $(window).scrollTop() || $pageMain.scrollTop();
          $root.addClass('modal--show');
          $pageMain.scrollTop(scrollTop);
          activeCount === 1 && ($pageRoot.addClass('show-modal'), $body.addClass('of-hidden'));
          $window.on('scroll', hide);
          $window.on('keyup', handleKeyup);
        } else {
          activeCount > 0 && activeCount --;
          $root.removeClass('modal--show');
          $window.scrollTop(scrollTop);
          activeCount === 0 && ($pageRoot.removeClass('show-modal'), $body.removeClass('of-hidden'));
          $window.off('scroll', hide);
          $window.off('keyup', handleKeyup);
        }
        onChange && onChange(visible);
      }
      function show() {
        setState(true);
      }
      function hide() {
        setState(false);
      }
      function handleKeyup(e) {
        // Char Code: 27  ESC
        if (e.which ===  27) {
          hide();
        }
      }
      setOptions(options);
      init();
      return {
        show: show,
        hide: hide
      };
    }
    $.fn.modal = modal;
  });
})();/*(function () {

})();*/</script><script>
  /* toc must before affix, since affix need to konw toc' height. */(function() {
  var SOURCES = window.TEXT_VARIABLES.sources;
  var TOC_SELECTOR = window.TEXT_VARIABLES.site.toc.selectors;
  window.Lazyload.js(SOURCES.jquery, function() {
    var $window = $(window);
    var $articleContent = $('.js-article-content');
    var $tocRoot = $('.js-toc-root'), $col2 = $('.js-col-aside');
    var toc;
    var tocDisabled = false;
    var hasSidebar = $('.js-page-root').hasClass('layout--page--sidebar');
    var hasToc = $articleContent.find(TOC_SELECTOR).length > 0;

    function disabled() {
      return $col2.css('display') === 'none' || !hasToc;
    }

    tocDisabled = disabled();

    toc = $tocRoot.toc({
      selectors: TOC_SELECTOR,
      container: $articleContent,
      scrollTarget: hasSidebar ? '.js-page-main' : null,
      scroller: hasSidebar ? '.js-page-main' : null,
      disabled: tocDisabled
    });

    $window.on('resize', window.throttle(function() {
      tocDisabled = disabled();
      toc && toc.setOptions({
        disabled: tocDisabled
      });
    }, 100));

  });
})();(function() {
  var SOURCES = window.TEXT_VARIABLES.sources;
  window.Lazyload.js(SOURCES.jquery, function() {
    var $window = $(window), $pageFooter = $('.js-page-footer');
    var $pageAside = $('.js-page-aside');
    var affix;
    var tocDisabled = false;
    var hasSidebar = $('.js-page-root').hasClass('layout--page--sidebar');

    affix = $pageAside.affix({
      offsetBottom: $pageFooter.outerHeight(),
      scrollTarget: hasSidebar ? '.js-page-main' : null,
      scroller: hasSidebar ? '.js-page-main' : null,
      scroll: hasSidebar ? $('.js-page-main').children() : null,
      disabled: tocDisabled
    });

    $window.on('resize', window.throttle(function() {
      affix && affix.setOptions({
        disabled: tocDisabled
      });
    }, 100));

    window.pageAsideAffix = affix;
  });
})();</script><script>var SOURCES = window.TEXT_VARIABLES.sources;
var PAHTS = window.TEXT_VARIABLES.paths;
window.Lazyload.js([SOURCES.jquery, PAHTS.search_js], function() {
  var searchData = window.TEXT_SEARCH_DATA ? initData(window.TEXT_SEARCH_DATA) : {};

  function memorize(f) {
    var cache = {};
    return function () {
      var key = Array.prototype.join.call(arguments, ',');
      if (key in cache) return cache[key];
      else return cache[key] = f.apply(this, arguments);
    };
  }

  function initData(data) {
    var _data = [], i, j, key, keys, cur;
    keys = Object.keys(data);
    for (i = 0; i < keys.length; i++) {
      key = keys[i], _data[key] = [];
      for (j = 0; j < data[key].length; j++) {
        cur = data[key][j];
        cur.title = window.decodeUrl(cur.title);
        cur.url = window.decodeUrl(cur.url);
        _data[key].push(cur);
      }
    }
    return _data;
  }

  /// search
  function searchByQuery(query) {
    var i, j, key, keys, cur, _title, result = {};
    keys = Object.keys(searchData);
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      for (j = 0; j < searchData[key].length; j++) {
        cur = searchData[key][j], _title = cur.title;
        if ((result[key] === undefined || result[key] && result[key].length < 4 )
          && _title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          if (result[key] === undefined) {
            result[key] = [];
          }
          result[key].push(cur);
        }
      }
    }
    return result;
  }

  var renderHeader = memorize(function(header) {
    return $('<p class="search-result__header">' + header + '</p>');
  });

  var renderItem = function(index, title, url) {
    return $('<li class="search-result__item" data-index="' + index + '"><a class="button" href="' + url + '">' + title + '</a></li>');
  };

  function render(data) {
    if (!data) { return null; }
    var $root = $('<ul></ul>'), i, j, key, keys, cur, itemIndex = 0;
    keys = Object.keys(data);
    for (i = 0; i < keys.length; i++) {
      key = keys[i];
      $root.append(renderHeader(key));
      for (j = 0; j < data[key].length; j++) {
        cur = data[key][j];
        $root.append(renderItem(itemIndex++, cur.title, cur.url));
      }
    }
    return $root;
  }

  // search box
  var $searchBox = $('.js-search-box');
  var $searchInput = $searchBox.children('input');
  var $searchClear = $searchBox.children('.js-icon-clear');
  var $result = $('.js-search-result'), $resultItems;
  var lastActiveIndex, activeIndex;

  function searchBoxEmpty() {
    $searchBox.removeClass('not-empty'); $result.html(null);
    $resultItems = $('.search-result__item'); activeIndex = 0;
  }

  $searchInput.on('input', window.throttle(function() {
    var val = $(this).val();
    if (val === '' || typeof val !== 'string') {
      searchBoxEmpty();
    } else {
      $searchBox.addClass('not-empty'); $result.html(render(searchByQuery(val)));
      $resultItems = $('.search-result__item'); activeIndex = 0;
      $resultItems.eq(0).addClass('active');
    }
  }, 400));
  $searchInput.on('focus', function() {
    $(this).addClass('focus');
  });
  $searchInput.on('blur', function() {
    $(this).removeClass('focus');
  });
  $searchClear.on('click', function() {
    $searchInput.val(''); searchBoxEmpty();
  });

  // search panel
  var $searchModal = $('.js-page-search-modal');
  var $searchToggle = $('.js-search-toggle');
  var modalVisible = false;

  var searchModal = $searchModal.modal({ onChange: handleModalChange });

  function handleModalChange(visible) {
    modalVisible = visible;
    if (visible) {
      $searchInput[0].focus();
    } else {
      $searchInput[0].blur();
      setTimeout(function() {
        $searchInput.val(''); searchBoxEmpty();
        window.pageAsideAffix && window.pageAsideAffix.refresh();
      }, 400);
    }
  }

  $searchToggle.on('click', function() {
    modalVisible ? searchModal.hide() : searchModal.show();
  });

  function updateResultItems() {
    lastActiveIndex >= 0 && $resultItems.eq(lastActiveIndex).removeClass('active');
    activeIndex >= 0 && $resultItems.eq(activeIndex).addClass('active');
  }

  function moveActiveIndex(direction) {
    var itemsCount = $resultItems ? $resultItems.length : 0;
    if (itemsCount > 1) {
      lastActiveIndex = activeIndex;
      if (direction === 'up') {
        activeIndex = (activeIndex - 1 + itemsCount) % itemsCount;
      } else if (direction === 'down') {
        activeIndex = (activeIndex + 1 + itemsCount) % itemsCount;
      }
      updateResultItems();
    }
  }

  // Char Code: 13  Enter, 37  ⬅, 38  ⬆, 39  ➡, 40  ⬇, 83  S, 191 /
  $(window).on('keyup', function(e) {
    if (modalVisible) {
      if (e.which === 38) {
        modalVisible && moveActiveIndex('up');
      } else if (e.which === 40) {
        modalVisible && moveActiveIndex('down');
      } else if (e.which === 13) {
        modalVisible && $resultItems && activeIndex >= 0 && $resultItems.eq(activeIndex).children('a')[0].click();
      }
    } else {
      if (!window.isFormElement(e.target || e.srcElement) && (e.which === 83 || e.which === 191)) {
        modalVisible || searchModal.show();
      }
    }
  });

  $result.on('mouseover', '.search-result__item > a', function() {
    var itemIndex = $(this).parent().data('index');
    itemIndex >= 0 && (lastActiveIndex = activeIndex, activeIndex = itemIndex, updateResultItems());
  });
});</script>
    </div>
    <script>(function () {
  var $root = document.getElementsByClassName('root')[0];
  if (window.hasEvent('touchstart')) {
    $root.dataset.isTouch = true;
    document.addEventListener('touchstart', function(){}, false);
  }
})();</script>
  </body>
</html>