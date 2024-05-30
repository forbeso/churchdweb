import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';

function FilterAndSortMenu({
  filters,
  defaultSort,
  onFilterChange,
  onSortChange,
}) {
  const [selectedFilters, setSelectedFilters] = useState(['Everyone']);
  const [sortOption, setSortOption] = useState(defaultSort);

  const handleFilterToggle = (filter) => {
    const newFilters = selectedFilters.includes(filter)
      ? selectedFilters.filter((f) => f !== filter)
      : [...selectedFilters, filter];
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortOption(newSort);
    onSortChange(newSort);
  };

  return (
    <div>
      <FormControl
        variant="outlined"
        style={{ minWidth: 120, marginRight: 16 }}
      >
        <InputLabel>Filters</InputLabel>
        <Select
          multiple
          value={selectedFilters}
          onChange={(e) => setSelectedFilters(e.target.value)}
          renderValue={(selected) => selected.join(', ')}
          label="Filters"
        >
          {filters.map((filter) => (
            <MenuItem key={filter} value={filter}>
              <Checkbox
                checked={selectedFilters.includes(filter)}
                onChange={() => handleFilterToggle(filter)}
              />
              <ListItemText primary={filter} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl variant="outlined" style={{ minWidth: 120 }}>
        <InputLabel>Sort by</InputLabel>
        <Select value={sortOption} onChange={handleSortChange} label="Sort by">
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="email">Email</MenuItem>
          <MenuItem value="date">Date Joined</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

FilterAndSortMenu.propTypes = {
  filters: PropTypes.arrayOf(PropTypes.string).isRequired,
  defaultSort: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onSortChange: PropTypes.func.isRequired,
};

export default FilterAndSortMenu;
