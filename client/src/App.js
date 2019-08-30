import React, { Component } from "react";
import axios from "axios";
import "./App.css";

import AppBar from "./components/AppBar";
import CMSBlocks from "./components/CMSBlocks";
import AddCMSBlock from "./components/AddCMSBlock";

class App extends Component {
  state = {
    cmsBlocks: []
  };

  componentWillMount = async () => {
    console.log(this.props.location);
    const response = await axios.get("/api/cms");
    this.setState({
      cmsBlocks: response.data
    });
  };

  //Add cms blocks
  addCMSBlock = async block => {
    const newBlock = {
      code: block.code,
      title: block.title,
      content: block.content,
      status: block.status,
      client_id: "1",
      page_id: block.page_id,
      section_id: block.section_id
    };

    try {
      console.log(this.props.location);
      const response = await axios.post("/api/cms", newBlock);

      this.setState({
        cmsBlocks: [newBlock, ...this.state.cmsBlocks]
      });
    } catch (error) {
      console.log(error);
    }
  };

  //delete an exsiting cms block.
  deleteBlock = async id => {
    try {
      const response = await axios.delete("/api/cms", {
        data: { id }
      });
      this.setState({
        cmsBlocks: this.state.cmsBlocks.filter(block => block.id !== id)
      });
    } catch (error) {
      console.log(error);
    }
  };

  //edit an exsiting cms block
  editCMSBlock = (id, data) => {
    try {
      const response = axios.put(`/api/cms/${id}`, data);

      this.setState({
        cmsBlocks: this.state.cmsBlocks.map(block => {
          if (block.id === id) {
            block = data;
          }
          return block;
        })
      });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="App">
        <AppBar />
        <div className="cmsContainer">
          <AddCMSBlock addCMSBlock={this.addCMSBlock} />
          <CMSBlocks
            cmsBlocks={this.state.cmsBlocks}
            deleteBlock={this.deleteBlock}
            editCMSBlock={this.editCMSBlock}
          />
        </div>
      </div>
    );
  }
}

export default App;