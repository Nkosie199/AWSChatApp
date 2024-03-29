import React from "react";
import PropTypes from "prop-types";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { graphql } from "react-apollo";
import detectLanguage from "../../graphql/AI/detectLanguage";
const langMap = [
  { code: "en", lang: "English" },
  { code: "zh", lang: "Chinese" },
  { code: "fr", lang: "French" },
  { code: "pt", lang: "Portuguese" },
  { code: "es", lang: "Spanish" },
];
const BOTS = {
  CHUCKBOT: "ChuckBot",
  MOVIEBOT: "MovieBot",
};

function readResponse(props) {
  const { data: { detectLanguage } = {} } = props;
  return detectLanguage ? detectLanguage.response : undefined;
}

class AIMenu extends React.Component {
  componentDidUpdate(prevProps, prevState, snapshot) {
    const oldResponse = readResponse(prevProps);
    const response = readResponse(this.props);

    if (!oldResponse && response) {
      const code = JSON.parse(response)[0].LanguageCode;
      console.log(`Detected Language from Direct Query: ${code}`);
      this.props.setLanguageCode(code);
    }
  }

  render() {
    const {
      msg,
      dropdownOpen,
      toggleDropDown,
      dictate,
      doBot,
      comprehend,
      setTranslation,
    } = this.props;
    const response = readResponse(this.props);
    const code = response ? JSON.parse(response)[0].LanguageCode : null;
    console.log(JSON.stringify(this.props, null, 2), response, code);
    const hasText = msg.content && msg.content.trim().length;
    return (
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropDown}>
        <DropdownToggle
          className="border-0 btn-sm py-0"
          style={{ backgroundColor: "transparent" }}
        >
          <i className="fas fa-caret-down" />
        </DropdownToggle>
        <DropdownMenu className="align-items-left">
          <DropdownItem header>Listen</DropdownItem>
          <DropdownItem onClick={dictate} className="small">
            <i className="fas fa-microphone-alt border border-dark rounded-circle p-1" />
            <span className="ml-1">Text to Speech</span>
          </DropdownItem>
          <DropdownItem header>Bots</DropdownItem>
          <DropdownItem
            value="ChuckBot"
            onClick={(e) => doBot({ bot: BOTS.CHUCKBOT })}
            className="small"
          >
            <i className="fas fa-robot border border-dark rounded-circle p-1" />
            <span className="ml-1">ChuckBot</span>
          </DropdownItem>
          <DropdownItem
            value="MovieBot"
            onClick={(e) => doBot({ bot: BOTS.MOVIEBOT })}
            className="small"
          >
            <i className="fas fa-robot border border-dark rounded-circle p-1" />
            <span className="ml-1">MovieBot</span>
          </DropdownItem>
          {hasText && (
            <React.Fragment>
              <DropdownItem header>Analyze</DropdownItem>
              <DropdownItem onClick={comprehend} className="small">
                <i className="fas fa-grin border border-dark rounded-circle p-1" />
                <span className="ml-1">Sentiment</span>
              </DropdownItem>
              <DropdownItem header>Translate</DropdownItem>
              {langMap.map((l) => (
                <DropdownItem
                  key={l.code}
                  value={l.code}
                  disabled={!code || code === l.code}
                  onClick={(e) => setTranslation({ selectedLanguage: l.code })}
                  className="small"
                >
                  <i className="fas fa-globe border border-dark rounded-circle p-1" />
                  <span className="ml-1">{l.lang}</span>
                </DropdownItem>
              ))}
            </React.Fragment>
          )}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

AIMenu.propTypes = {
  msg: PropTypes.object.isRequired,
  dropdownOpen: PropTypes.bool.isRequired,
  toggleDropDown: PropTypes.func.isRequired,
  setLanguageCode: PropTypes.func.isRequired,
  setTranslation: PropTypes.func.isRequired,
  comprehend: PropTypes.func.isRequired,
  doBot: PropTypes.func.isRequired,
  dictate: PropTypes.func.isRequired,
  data: PropTypes.object,
};

const AIMenuWithData = graphql(detectLanguage, {
  skip: (props) => !props.msg || !props.dropdownOpen,
  options: (props) => ({
    variables: {
      text: props.msg.content,
    },
  }),
})(AIMenu);

export default AIMenuWithData;
