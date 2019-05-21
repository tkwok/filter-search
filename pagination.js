const Pagination = {
    code: '',
    Extend: function(data) {
      data = data || {};
      Pagination.size = data.size || 300;
      Pagination.page = data.page || 1;
      Pagination.step = data.step || 3;
    },
    Add: function(count, step) {
      for (let i = count, len = step; i < len; i++) {
          Pagination.code += '<a class="page-number">' + i + '</a>';
      }
    },
    Last: function() {
      Pagination.code += '<i>...</i><a class="page-number">' + Pagination.size + '</a>';
    },
    First: function() {
      Pagination.code += '<a class="page-number">1</a><i>...</i>';
    },
    Click: function() {
      const jumpPage = +this.innerHTML
      if (Pagination.page !== jumpPage) {
        Pagination.page = jumpPage;
        Pagination.Start();
        Pagination.Dispatch();
      }
    },
    Prev: function() {
      Pagination.page--;
      if (Pagination.page < 1) Pagination.page = 1;
      Pagination.Start();
      Pagination.Dispatch();
    },
    Dispatch: function() {
      Pagination.parentElement.dispatchEvent(new CustomEvent('pageChange', {
        detail: { pageNumber: Pagination.page }
      }));
    },
    Next: function() {
      console.log(Pagination.page + ":" + Pagination.size);
      if (Pagination.size < 1) Pagination.size = 1;
      Pagination.page++;
      if (Pagination.page > Pagination.size) Pagination.page = Pagination.size;
      Pagination.Start();
      Pagination.Dispatch();
    },
    Bind: function() {
      const linkElements = Pagination.event.getElementsByTagName('a');
      for (let i = 0, len = linkElements.length; i < len; i++) {
          if (+linkElements[i].innerHTML === Pagination.page) linkElements[i].className = 'current';
          linkElements[i].addEventListener('click', Pagination.Click, false);
      }
    },
    Finish: function() {
      Pagination.event.innerHTML = Pagination.code;
      Pagination.code = '';
      Pagination.Bind();
    },
    Start: function() {
      if (Pagination.size < Pagination.step * 2 + 6) {
          Pagination.Add(1, Pagination.size + 1);
      }
      else if (Pagination.page < Pagination.step * 2 + 1) {
          Pagination.Add(1, Pagination.step * 2 + 4);
          Pagination.Last();
      }
      else if (Pagination.page > Pagination.size - Pagination.step * 2) {
          Pagination.First();
          Pagination.Add(Pagination.size - Pagination.step * 2 - 2, Pagination.size + 1);
      }
      else {
          Pagination.First();
          Pagination.Add(Pagination.page - Pagination.step, Pagination.page + Pagination.step + 1);
          Pagination.Last();
      }
      Pagination.Finish();
    },
    Buttons: function(e) {
      const nav = e.getElementsByTagName('a');
      nav[0].addEventListener('click', Pagination.Prev, false);
      nav[nav.length-1].addEventListener('click', Pagination.Next, false);
    },
    Create: function(event) {
      const html = [
          '<a id="btn-page-prev">&lt; Prev</a>', // previous button
          '<span></span>',  // pagination container
          '<a id="btn-page-next">Next &gt;</a>'  // next button
      ];
      event.innerHTML = html.join('');
      Pagination.event = event.getElementsByTagName('span')[0];
      Pagination.parentElement = event;
    },
    Init: function(event, data) {
      Pagination.Extend(data);
      Pagination.Create(event);
      Pagination.Start();
      Pagination.Buttons(event);
    }
};
