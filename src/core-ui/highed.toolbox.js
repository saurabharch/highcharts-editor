/******************************************************************************

Copyright (c) 2016, Highsoft

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

******************************************************************************/

// @format

highed.Toolbox = function(parent, attr) {
  var events = highed.events(),
    container = highed.dom.cr(
      'div',
      'highed-transition highed-toolbox highed-box-size'
    ),
    bar = highed.dom.cr('div', 'highed-toolbox-bar highed-box-size'),
    body = highed.dom.cr(
      'div',
      'highed-toolbox-body highed-box-size highed-transition'
    ),
    expanded = false,
    activeItem = false,
    properties = highed.merge(
      {
        animate: true
      },
      attr
    );

  function addEntry(def) {
    var props = highed.merge(
        {
          title: 'Tooltip Missing',
          icon: 'fa-trash',
          width: 200
        },
        def
      ),
      entryEvents = highed.events(),
      title = highed.dom.cr('div', 'highed-toolbox-body-title', props.title),
      contents = highed.dom.cr(
        'div',
        'highed-box-size highed-toolbox-inner-body'
      ),
      userContents = highed.dom.cr(
        'div',
        'highed-box-size highed-toolbox-user-contents'
      ),
      helpIcon = highed.dom.cr(
        'div',
        'highed-toolbox-help highed-icon fa fa-question-circle'
      ),
      iconClass = 'highed-box-size highed-toolbox-bar-icon fa ' + props.icon,
      icon = highed.dom.cr('div', iconClass),
      helpModal = highed.HelpModal(props.help || []),
      exports = {};

    function resizeBody() {
      var bsize = highed.dom.size(body),
        tsize = highed.dom.size(title),
        size = {
          w: bsize.w,
          h: bsize.h - tsize.h
        };

      highed.dom.style(contents, {
        width: size.w + 'px',
        height: size.h + 'px'
      });

      return size;
    }

    function expand() {
      var bsize = highed.dom.size(bar);
      var newWidth = bsize.w + props.width;

      if (expanded && activeItem === exports) {
        return;
      }

      if (activeItem) {
        activeItem.disselect();
      }

      body.innerHTML = '';
      highed.dom.ap(body, contents);

      highed.dom.style(body, {
        width: props.width + 'px',
        height: bsize.h + 'px',
        opacity: 1
      });

      highed.dom.style(container, {
        width: newWidth + 'px'
      });

      events.emit('BeforeResize', newWidth);

      expanded = true;

      setTimeout(function() {
        var height = resizeBody().h;

        events.emit('Expanded', exports, newWidth);
        entryEvents.emit('Expanded', newWidth, height - 20);
      }, 300);

      icon.className = iconClass + ' highed-toolbox-bar-icon-sel';
      activeItem = exports;

      highed.dom.style(helpIcon, {
        display: 'block'
      });
    }

    function collapse() {
      var newWidth = highed.dom.size(bar).w;

      if (expanded) {
        highed.dom.style(body, {
          width: '0px',
          opacity: 0.1
        });

        highed.dom.style(container, {
          width: newWidth + 'px'
        });

        events.emit('BeforeResize', newWidth);

        disselect();
        expanded = false;
        activeItem = false;

        highed.dom.style(helpIcon, {
          display: 'none'
        });
      }
    }

    function toggle() {
      if (activeItem === exports) {
        collapse();
      } else {
        expand();
      }
    }

    function disselect() {
      icon.className = iconClass;
    }

    function showHelp() {
      helpModal.show();
      return;

      // Hack.
      var h = highed.OverlayModal(false, {
        width: 600,
        height: 500
      });

      highed.dom.ap(h.body,
        highed.dom.cr('div', 'highed-toolbox-body-title', 'Manualy Defining Data'),
        highed.dom.style(highed.dom.cr('div'), {
          'background-image': 'url("help/dataImport.gif")',
          'background-size': '100% auto',
          'height': '200px',
          'background-repeat': 'no-repeat',
          'width': '100%'
        }),
        highed.dom.style(highed.dom.cr('div', '', [
          'Data can be manually entered and modified directly in the data table.<br/><br/>',
          'The cells can be navigated using the arrow keys.',
          'Pressing Enter creates a new row, or navigates to the row directly below the current row.<br/><br/>',
          'The headings are used as the axis titles, and can be changed by clicking them.'
        ].join(' ')), {
          'margin-top': '10px',
           'padding': '5px',
          'text-align': 'center'
        }),
        highed.dom.ap(highed.dom.style(highed.dom.cr('div'), {
            'width': '120px',
            'height': '25px',
            'position': 'absolute',
            'bottom': '10px',
            'left': '50%',
            'transform': 'translate(-50%, 0)'
          }),
          highed.dom.cr('span', 'highed-icon fa fa-circle'),
          highed.dom.cr('span', 'highed-icon fa fa-circle-o'),
          highed.dom.cr('span', 'highed-icon fa fa-circle-o')
        )
      );

      h.show();
    }

    highed.dom.on(helpIcon, 'click', showHelp);
    highed.dom.on(icon, 'click', toggle);
    highed.dom.ap(bar, icon);
    highed.dom.ap(contents, highed.dom.ap(title, helpIcon), userContents);

    exports = {
      on: entryEvents.on,
      expand: expand,
      collapse: collapse,
      body: userContents,
      disselect: disselect
    };

    return exports;
  }

  function width() {
    var bodySize = highed.dom.size(body),
      barSize = highed.dom.size(bar);

    return bodySize.w + barSize.w;
  }

  function clear() {}

  highed.dom.ap(parent, highed.dom.ap(container, bar, body));

  return {
    clear: clear,
    on: events.on,
    addEntry: addEntry,
    width: width
  };
};