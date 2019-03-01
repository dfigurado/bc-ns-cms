import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import CKEditor from "ckeditor4-react";

class AddCMSBlock extends Component {
  state = {
    open: false,
    code: "",
    title: "",
    content: "",
    status: true
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handelChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  handelContentChange = e => {
    this.setState({
      content: e.editor.getData()
    });
  };

  handelStatusChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  submitForm = e => {
    const { code, title, content, status } = this.state;
    const newCMSBlock = {
      code,
      title,
      content,
      status
    };
    this.props.addCMSBlock(newCMSBlock);
    this.handleClose();
  };

  render() {
    return (
      <div>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
        >
          Add CMS Blocks
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add CMS Block</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To Add CMS Block, please enter relavent fields.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="code"
              name="code"
              value={this.state.code}
              label="code"
              type="text"
              onChange={this.handelChange}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="title"
              name="title"
              value={this.state.title}
              label="title"
              type="text"
              onChange={this.handelChange}
              fullWidth
            />
            <FormControlLabel
              label="status"
              control={
                <Switch
                  checked={this.state.status}
                  onChange={this.handelStatusChange("status")}
                  value="status"
                  color="primary"
                />
              }
            />

            <CKEditor
              data={this.state.content}
              onChange={this.handelContentChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.submitForm} color="primary">
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default AddCMSBlock;
