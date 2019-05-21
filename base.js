document.addEventListener('DOMContentLoaded', () => {
  const tierLevels = [
    'Diamond',
    'Platinum',
    'Gold',
    'Silver',
    'Bronze'
  ];

  let filterValue = {
    searchText: '',
    country: null,
    region: null,
    tierLevel: null
  };

  let resultPartners = JSON.parse(JSON.stringify(partners));

  const searchInput = document.getElementById('input-search');
  const countrySelect = document.getElementById('select-country');
  const regionSelect = document.getElementById('select-region');
  const tierLevelSelect = document.getElementById('select-tier-level');
  const partnersRow = document.getElementById('row-partners');
  const linkShowNumbers = document.getElementById('link-show-numbers');
  /* Pagination */
  let currentPage = 1;
  let recordsPerPage = 6;

  const btnPageNext = document.getElementById("btn-page-next");
  const btnPagePrev = document.getElementById("btn-page-prev");
  const pageSpan = document.getElementById("page");
  const paginationElement = document.getElementById('pagination');

  function init() {
    const countries = getUniqueValues('country', partners);
    addOptions('select-tier-level', tierLevels);
    addOptions('select-country', countries);

    changeCurrentPage(1);
    addEventListeners(countries);

    Pagination.Init(paginationElement, {
      size: resultPartners.length / 6, page: 1, step: 3
    });
  }

  function applyShowHideListeners() {
    let parentElement = {};

    Array.from(document.getElementsByClassName('link-partner-card-flip'))
    .forEach(element => {
      element.addEventListener('click', item => {
        item.preventDefault();
        item.stopPropagation();
        parentElement = item.srcElement.parentElement;
        parentElement.style.display = 'none';

        parentElement.classList.contains('partner-card-front') ?
          parentElement.nextElementSibling.style.display = 'block' :
          parentElement.previousElementSibling.style.display = 'block';
      });
    });
  }

  function addEventListeners(countries) {
    let resultValue, searchInputResult = '', res;

    searchInput.addEventListener('keydown', event => {
      event.stopPropagation();
      const inputValue = event.which;

      if(!(inputValue >= 65 && inputValue <= 120) &&
        (inputValue != 32 && inputValue != 0 && inputValue != 8)) {
        event.preventDefault();
      } else {
        res = filterValue.searchText.split('');
        inputValue != 8 ? res.push(event.key) : res.pop();
        filterValue.searchText = res.join('');
        if (filterValue.searchText.length > 3 || filterValue.searchText.length === 0) {
          filterAllValues();
        }
      }
    });

    searchInput.addEventListener('select', function() {
      this.selectionStart = this.selectionEnd;
    }, false);

    countrySelect.addEventListener('change', event => {
      event.stopPropagation();
      resultValue = event.target.value;
      if (resultValue && resultValue >= 0) {
        filterValue.country = countries[resultValue];
        regions = getUniqueValues('region', partners, true, 'country', countries[resultValue]);
        regionSelect.options.length = 1;
        if (regions.length > 1) {
          addOptions('select-region', regions);
        }
        filterValue.region = null;
        filterValue.tierLevel = null;
      } else {
        filterValue.country = null;
        filterValue.region = null;
        filterValue.tierLevel = null;
        // reset all dropdowns
      }
      regionSelect.selectedIndex = 0;
      tierLevelSelect.selectedIndex = 0;
      filterAllValues();
    });

    regionSelect.addEventListener('change', event => {
      event.stopPropagation();
      resultValue = event.target.value;
      filterValue.region = resultValue && resultValue >= 0 && regions.length > 0 ?
        filterValue.region = regions[event.target.value] : filterValue.region = null;
      filterAllValues();
    });

    tierLevelSelect.addEventListener('change', event => {
      event.stopPropagation();
      resultValue = event.target.value || null;
      filterValue.tierLevel = resultValue && resultValue >= 0 ? resultValue : null;
      filterAllValues();
    });

    document.getElementById("link-clear-all-filters").addEventListener('click', event => {
      event.preventDefault();
      clearAllFilters();
    });

    linkShowNumbers.addEventListener('click', event => {
      event.preventDefault();
      recordsPerPage = (recordsPerPage === 6) ? 25 : 6;
      changeCurrentPage(1);
      Pagination.Init(paginationElement, {
        size: resultPartners.length / recordsPerPage, page: 1, step: 3
      });
    });

    paginationElement.addEventListener('pageChange', event => {
      event.preventDefault();
      changeCurrentPage(parseInt(event.detail.pageNumber));
    });
  }

  function singlePartnerCard(item) {
    return `
      <div class="partner-card col-md-4 text-center">
        <div class="partner-card-front partner-list-item">
          <h6>${tierLevels[item.level]}</h6>
          <h6>logo</h6>
          <p>Your trusted CRM choices just got better! Act! now includes dynamic sales pipeline management and
          powerful new Marketing Automation, </p>
          <a class="link-partner-card-flip show text-right">See details [+]</a>
        </div>
        <div class="partner-card-back partner-list-item" style="display: none">
          <h6><strong>${item.company}</strong></h6>
          <h6>${item.city}</h6>
          <br/>
          <h6>${item.email}</h6>
          <br/>
          <h6>${item.phone}</h6>
          <h6>${item.website}</h6>
          <br/>
          <h6>Certified since: 1992</h6>
          <a class="link-partner-card-flip text-right">Hide details [-]</a>
        </div>
      </div>`;
  }

  function filterAllValues() {
    resultPartners = JSON.parse(JSON.stringify(partners));
    if (filterValue.searchText.length > 0) resultPartners = filterTextResult(resultPartners, 'company', filterValue.searchText);
    if (filterValue.country) resultPartners = filterResult(resultPartners, 'country', filterValue.country);
    if (filterValue.region) resultPartners = filterResult(resultPartners, 'region', filterValue.region);
    if (filterValue.tierLevel) resultPartners = filterResult(resultPartners, 'level', parseInt(filterValue.tierLevel));
    changeCurrentPage(1);
    if (resultPartners.length <= 0) {
      partnersRow.innerHTML = '<h5>Sorry, no results found.<h5>';
      paginationElement.style.display = "none";
    } else paginationElement.style.display = "block";

    let val = Math.round(resultPartners.length / recordsPerPage);
    console.log(val);
    Pagination.Init(paginationElement, {
      size: resultPartners.length / recordsPerPage, page: 1, step: 3
    });
  }

  function filterResult(arr, key, value) {
    return arr.filter(result => { return result[key] === value; });
  }

  function filterTextResult(arr, key, value) {
    return arr.filter(result => { return result[key].toLowerCase().includes(value.toLowerCase()); });
  }

  function getUniqueValues(key, arr, filter=false, filterKey=0, filterValue='') {
    return arr.map(value => {
      if (filter) {
        if (value[filterKey] === filterValue) return value[key];
      } else {
        return value[key];
      }
    }).filter((value, index, self) => {
      return self.indexOf(value) === index && value != void 0 && value != '';
    }).sort();
  }

  function addOptions(elementId, arr) {
    let option = {};

    arr.forEach((value, index) => {
      option = document.createElement('option');
      option.text = value;
      option.value = index;
      document.getElementById(elementId).add(option);
    });
  }

  function clearAllFilters() {
    /* clear all select options */
    countrySelect.selectedIndex = 0;
    regionSelect.selectedIndex = 0;
    tierLevelSelect.selectedIndex = 0;

    /* clear filter state values */
    filterValue.searchText = '';
    filterValue.country = null;
    filterValue.region = null;
    filterValue.tierLevel = null;

    filterAllValues();
  }

  /* pagination */
  function getNumPages() {
      return Math.ceil(resultPartners.length / recordsPerPage);
  }

  function changeCurrentPage(page) {
    const partnersRow = document.getElementById('row-partners');
    const pagePast = recordsPerPage * page;
    const firstPageCounter = page === 1 ? page : pagePast - recordsPerPage + 1;

    currentPage = page;

    if (page <= 1) page = 1;
    if (page > getNumPages()) page = getNumPages();

    linkShowNumbers.innerHTML = '(showing ' + recordsPerPage +')';
    partnersRow.innerHTML = '';
    for (let i=(page-1) * recordsPerPage; i < (page * recordsPerPage) && i < resultPartners.length; i++) {
        if (resultPartners.length > 0) partnersRow.innerHTML += singlePartnerCard(resultPartners[i]);
    }

    pageSpan.innerHTML =  firstPageCounter + '-' + pagePast +' of ' + resultPartners.length;
    applyShowHideListeners();
  }

  init();
});
