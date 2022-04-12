import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Dropdown, Button } from "semantic-ui-react";

const CategoryLinks = (props) => {
  const [categories, setCategories] = useState([]);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/blog/all-categories`
        );
        setCategories(res.data);
      } catch (err) {}
    };
    fetchCategories();
  }, []);

  const getRemoveFilterBtnActivity = isCategorySelected ? "active" : "disabled";

  return (
    <div className="p-4 p-md-0 mb-2 text-white rounded">
      <Dropdown
        text="Filter"
        icon="filter"
        floating
        labeled
        button
        className="icon"
      >
        <Dropdown.Menu>
          <Dropdown.Header icon="tags" content="Filter by tag" />
          <Dropdown.Divider />
          {categories &&
            categories.map((category) => (
              <Dropdown.Item
                onClick={() => {
                  props.onFilter(category);
                  setIsCategorySelected(true);
                }}
              >
                {category}
              </Dropdown.Item>
            ))}
        </Dropdown.Menu>
      </Dropdown>
      <Button
        onClick={() => {
          props.onFilter(null);
          setIsCategorySelected(false);
        }}
        className={getRemoveFilterBtnActivity}
      >
        Remove Filter
      </Button>
    </div>
  );
};

export default CategoryLinks;
