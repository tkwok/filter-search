const Main = {
  Extend: function() {
    Main.tierLevels = [
      'Diamond',
      'Platinum',
      'Gold',
      'Silver',
      'Bronze'
    ];
    Main.filterValue = {
      searchText: '',
      country: null,
      region: null,
      tierLevel: null
    };
  },
  Create: function() {
    const template = `
      
    `;
    event.innerHTML = html.join('');
    Pagination.event = event.getElementsByTagName('span')[0];
    Pagination.parentElement = event;
  },
  Init: function() {
    Main.Extend();
  }
}
