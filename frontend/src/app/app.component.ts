import { HttpClient } from '@angular/common/http';
import {  Component, OnInit } from '@angular/core';
import { ChatService } from './AllServices/chatService';
import { user } from './user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {


  public roomId: any;
  public messageText: any;
  public messageArray: { user: string, message: string }[] = [];
  messageArrayGroup : { user: string, message: string }[] = [];
  private storageArray :any;
  private storageArrayGroup :any;
  userListUrl ="assets/userList.json"
  public showScreen = false;
  public phone: any
  public currentUser:any;
  public selectedUser:any;
  groupChat=[Number]
  user= new user()
  userList:any;
  errorMsg: boolean=false;
  alertMsg: string="";
  loginForm: any;
  roomChat:Object={id:7,users:[]}

  constructor(
    private chatService: ChatService,
    public http: HttpClient,
  ) {

  }
  

  ngOnInit(): void {
    this.getUsers()
    this.user.email=''
    this.chatService.getMessage().subscribe(
      (data: { user: string, room: string, message: string }) => {
        this.messageArray.push(data);
        if (this.roomId != 7) {
          setTimeout(() => {
            this.storageArray = this.chatService.getStorage();
            const storeIndex = this.storageArray
              .findIndex((storage:any) => storage.roomId === this.roomId);
            this.messageArray = this.storageArray[storeIndex].chats;
          }, 500);
        }
        else{
          setTimeout(() => {
            this.storageArrayGroup = this.chatService.getStorageGroup();
            const storeIndex = this.storageArrayGroup
              .findIndex((storage:any) => storage.roomId == 7);
            this.messageArrayGroup = this.storageArrayGroup[storeIndex].chats;
          }, 500);
        }
      });
  }

  getMessageGroup(){
    this.chatService.getMessage().subscribe(
      (data: { user: string, room: string, message: string }) => {
        this.messageArrayGroup.push(data);
        if (this.roomId) {
          setTimeout(() => {
            this.storageArray = this.chatService.getStorage();
            const storeIndex = this.storageArray
              .findIndex((storage:any) => storage.roomId === this.roomId);
            this.messageArrayGroup = this.storageArray[storeIndex].chats;
          }, 500);
        }
      });
      console.log("this.messageArrayGroup",this.messageArrayGroup)
  }


  addToGroupChat(){ 
      this.groupChat.push(this.selectedUser.id)
      this.groupChat = this.groupChat.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
    },
    this.getMessageGroup()
    )
    

    console.log("this.groupChat",this.groupChat)
  }
  getUsers(){
    this.http.get(this.userListUrl).subscribe(
      data => {
        console.log("data",data)  
             this.userList = data;
    });
  }

  login(): void {
    this.userList.forEach((element: any) => {
      if(this.user.email==element.email){
        this.currentUser=element
      }
    });
    if (this.currentUser?.id) {
      this.userList = this.userList.filter((user:any) => user.email != this.currentUser.email);
      this.groupChat.push(this.currentUser.id)
    }else{
      this.errorMsg=true
      this.alertMsg='Champ vide ou e-mail invalid'
    }
  }

  selectUserHandler(email: string): void {
    this.selectedUser = this.userList.find((user:any) => user.email === email);
    this.roomId = this.selectedUser.roomId[this.currentUser.id];
    this.messageArray = [];
    this.storageArray = this.chatService.getStorage();
    const storeIndex = this.storageArray
      .findIndex((storage:{roomId:any}) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.messageArray = this.storageArray[storeIndex].chats;
    }

    this.join(this.currentUser.name, this.roomId);
    console.log("groupChat",this.groupChat)
  }

  join(username: string, roomId: string): void {
    this.chatService.joinRoom({user: username, room: roomId});
  }

  sendMessage(groupchat:boolean): void {
    console.log("groupchat",groupchat)
    if(groupchat){
      this.chatService.sendMessage({
        user: this.currentUser.name,
        room: 7,
        message: this.messageText
      });
      
    }else{

      this.chatService.sendMessage({
        user: this.currentUser.name,
        room: this.roomId,
        message: this.messageText
      });
    }


    this.storageArray = this.chatService.getStorage();
    this.storageArrayGroup=this.chatService.getStorageGroup()
    
    const storeIndex = this.storageArray
      .findIndex((storage:any) => storage.roomId === this.roomId);

      const storeIndexGroup = this.storageArray
      .findIndex((storage:any) => storage.roomId === this.roomId);

    if (storeIndex > -1) {
      this.storageArray[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      });
      this.storageArrayGroup[storeIndex].chats.push({
        user: this.currentUser.name,
        message: this.messageText
      });
      }

      if (storeIndexGroup > -1) {
        this.storageArray[storeIndexGroup].chats.push({
          user: this.currentUser.name,
          message: this.messageText
        });
        this.storageArrayGroup[storeIndexGroup].chats.push({
          user: this.currentUser.name,
          message: this.messageText
        });
        }


      else {
      const updateStorage = {
        roomId: this.roomId,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };

      const updateStorage2 = {
        roomId: 7,
        chats: [{
          user: this.currentUser.name,
          message: this.messageText
        }]
      };

      this.storageArray.push(updateStorage);
      this.storageArrayGroup.push(updateStorage2);
    }

    this.chatService.setStorage(this.storageArray);
    this.chatService.setStorageGroup(this.storageArrayGroup)
    this.messageText = '';
  }

}
