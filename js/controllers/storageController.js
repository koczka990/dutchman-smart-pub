import StorageModel from "../models/storageModel.js";
import StorageView from "../views/storageView.js";

class StorageController {
  constructor(app) {
    this.app = app;
    this.model = new StorageModel();
    this.view = new StorageView();
    this.init();
  }

  async init() {
    await this.model.loadStorageData();
  }

  render() {
    const storageItems = this.model.getAllStorageNames();
    this.view.render(storageItems);
  }
}

export default StorageController;
