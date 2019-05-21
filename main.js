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
      <div class="input-icon-magnifier">
        <input id="input-search" class="select-partner" type="text" placeholder="Search"/>
        <img src=""/>
      </div>
      <label for="select-country" class="label-common">Country</label>
      <div class="select-icon-arrow">
        <select id="select-country" class="select-partner">
          <option value="-1">All countries</option>
        </select>
      </div>
      <label for="select-region" class="label-common">Region</label>
      <div class="select-icon-arrow">
        <select id="select-region" class="select-partner">
          <option value="-1">All regions</option>
        </select>
      </div>
      <label for="select-tier-level" class="label-common">Tier Level</label>
      <div class="select-icon-arrow">
        <select id="select-tier-level" class="select-partner">
          <option value="-1">All levels</option>
        </select>
      </div>
      <a href="" id="link-clear-all-filters"><strong>Clear all filters</strong></a>
    `;
    event.innerHTML = template;
  },
  Init: function() {
    Main.Extend();
  }
}
