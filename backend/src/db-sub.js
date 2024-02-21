import { User, Token, WorkOrder, WorkDetail, WorkLog, Item, Client, RemnantDetail, RemnantZone } from "./db.js";
  (async () => {
  
    User.table = User.getTable();
    User.dateFormat = await User.formatDate();
    
    Token.table = Token.getTable();
    Token.dateFormat = await Token.formatDate();
    
    WorkOrder.table = WorkOrder.getTable();
    WorkOrder.dateFormat = await WorkOrder.formatDate();
    
    WorkDetail.table = WorkDetail.getTable();
    WorkDetail.dateFormat = await WorkDetail.formatDate();
    
    WorkLog.table = WorkLog.getTable();
    WorkLog.dateFormat = await WorkLog.formatDate();
    
    Item.table = Item.getTable();
    Item.dateFormat = await Item.formatDate();
    
    Client.table = Client.getTable();
    Client.dateFormat = await Client.formatDate();
    
    RemnantDetail.table = RemnantDetail.getTable();
    RemnantDetail.dateFormat = await RemnantDetail.formatDate();
    
  RemnantZone.table = RemnantZone.getTable();
  RemnantZone.dateFormat = await RemnantZone.formatDate();
  })();
  