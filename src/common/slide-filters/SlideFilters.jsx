import 'rc-slider/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Tooltip from 'rc-tooltip';
import Slider from 'rc-slider';
import { YoutubeService } from '../../services/youtube/Youtube';
import './SlideFilters.scss';
import { appConfig } from '../../config';

const service = new YoutubeService();
const countryList = appConfig.countryList;

const Handle = Slider.Handle;

const handle = props => {
  const { value, dragging, index, ...restProps } = props;
  return (
    <Tooltip
      prefixCls="rc-slider-tooltip"
      overlay={value}
      visible={dragging}
      placement="top"
      key={index}
    >
      <Handle value={value} {...restProps} />
    </Tooltip>
  );
};

handle.propTypes = {
  value: PropTypes.number,
  dragging: PropTypes.func,
  index: PropTypes.number
};

function renderInput(inputProps) {
  const { InputProps, ref, ...other } = inputProps;
  return (
    <TextField
      InputProps={{
        inputRef: ref,
        ...InputProps
      }}
      {...other}
    />
  );
}

function renderSuggestion({
  suggestion,
  index,
  itemProps,
  highlightedIndex,
  selectedItem
}) {
  const isHighlighted = highlightedIndex === index;

  const selectedName = selectedItem ? selectedItem.name : '';

  const isSelected = selectedName.indexOf(suggestion.name) > -1;

  return (
    <MenuItem
      {...itemProps}
      key={index}
      selected={isHighlighted}
      component="div"
      style={{
        fontWeight: isSelected ? 500 : 400
      }}
    >
      {suggestion.name}
    </MenuItem>
  );
}

renderSuggestion.propTypes = {
  highlightedIndex: PropTypes.number,
  index: PropTypes.number,
  itemProps: PropTypes.object,
  selectedItem: PropTypes.string,
  suggestion: PropTypes.shape({ name: PropTypes.string }).isRequired
};

class SlideFilters extends Component {
  constructor(props) {
    super(props);
    this.state = { categoryList: [], isLoading: false };
  }

  componentDidMount() {
    this.setState({ isLoading: true, categoryList: [] });

    service
      .getCategoryList()
      .then(data => this.setState({ isLoading: false, categoryList: data }))
      .catch(() => this.setState({ isLoading: false, categoryList: [] }));
  }

  render() {
    const videosToLoadChange = val => {
  
      this.props.config.saveMaxVideos(val);
      this.props.onChanges();
    };

    const countryChanged = countryCode => {
     
      this.props.config.saveRegion(countryCode);
      this.props.onChanges();
    };

    const categoryChanged = categoryId => {
  
      this.props.config.saveCategory(categoryId);
      this.props.onChanges();
    };

    if (this.state.isLoading) {
      return <label>Loading Categories...</label>;
    }

    let chosencatId = this.props.config.getCategoryId();

    const selectedCategoryItem = this.state.categoryList.find(
      cat => cat.id === chosencatId
    );

    const selectedCountryItem = countryList.find(
      country => country.code === this.props.config.getRegion()
    );



    return (
      <div className="slide-filters-container">
        <h3 className="title">
          Filters
          <Button className="mat-icon-button" onClick={this.props.onClose}>
            <CloseIcon aria-label="Close" />
          </Button>
        </h3>
        <Downshift
          id="countrySelect"
          onChange={selection => countryChanged(selection.code)}
          itemToString={selection => (selection ? selection.name : '')}
          selectedItem={selectedCountryItem}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            highlightedIndex,
            isOpen,
            inputValue,
            selectedItem
          }) => (
            <div>
              {renderInput({
                fullWidth: true,
                InputProps: getInputProps(),
                label: 'Select Country'
              })}
              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper square>
                    {countryList
                      .filter(
                        country =>
                          !inputValue ||
                          country.name
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                      )
                      .map((suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: getItemProps({ item: suggestion }),
                          highlightedIndex,
                          selectedItem
                        })
                      )}
                  </Paper>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
        <div className="divider" />
        <Downshift
          id="categorySelect"
          onChange={selection => categoryChanged(selection.id)}
          itemToString={selection => (selection ? selection.name : '')}
          selectedItem={selectedCategoryItem}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            highlightedIndex,
            isOpen,
            inputValue,
            selectedItem
          }) => (
            <div>
              {renderInput({
                fullWidth: true,
                InputProps: getInputProps(),
                label: 'Select Category'
              })}
              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper square>
                    {this.state.categoryList
                      .filter(
                        category =>
                          !inputValue ||
                          category.name
                            .toLowerCase()
                            .includes(inputValue.toLowerCase())
                      )
                      .map((suggestion, index) =>
                        renderSuggestion({
                          suggestion,
                          index,
                          itemProps: getItemProps({ item: suggestion }),
                          highlightedIndex,
                          selectedItem
                        })
                      )}
                  </Paper>
                ) : null}
              </div>
            </div>
          )}
        </Downshift>
        <div className="divider" />
        <div className="videosCountPerPage">
          <div className="caption">Count of videos on the page</div>
          <div className="slider">
            <Slider
              min={1}
              max={200}
              defaultValue={this.props.config.getMaxVideos()}
              handle={handle}
              onAfterChange={videosToLoadChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

SlideFilters.propTypes = {
  config: PropTypes.object,
  onChanges: PropTypes.func,
  onClose: PropTypes.func
};

export default SlideFilters;
