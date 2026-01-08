import { CoreModule, ConfigStateService } from '@abp/ng.core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '@proxy/dev/acadmy/chats';
import { CreateUpdateChatMessageDto } from '@proxy/dev/acadmy/dtos/request/chats';
import { ChatMessageDto } from '@proxy/dev/acadmy/dtos/response/chats';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-list-chat',
  standalone: true,
  imports: [CoreModule, CommonModule, NgIf, NgFor, FormsModule],
  templateUrl: './list-chat.component.html',
  styleUrl: './list-chat.component.scss'
})
export class ListChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: ChatMessageDto[] = [];
  newMessage: string = '';
  receiverId: string = '';
  currentUserId: string = '';
  loading = false;
  sending = false;

  // متغيرات خاصة بالتعديل
  editingMessageId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private configState: ConfigStateService
  ) {
    this.currentUserId = this.configState.getOne("currentUser").id;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.receiverId = params['id']; 
      this.loadMessages();
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadMessages() {
    this.loading = true;
    this.chatService.getMessages(this.receiverId, 1, 100)
      .pipe(finalize(() => this.loading = false))
      .subscribe(res => {
        this.messages = res.items || [];
      });
  }

  // دالة الإرسال الرئيسية (تتعامل مع الإرسال الجديد والتعديل)
  send() {
    if (!this.newMessage.trim() || this.sending) return;

    const input: CreateUpdateChatMessageDto = {
      receverId: this.receiverId,
      message: this.newMessage
    };

    this.sending = true;

    if (this.editingMessageId) {
      // حالة التعديل (Update)
      this.chatService.updateMessage(this.editingMessageId, input)
        .pipe(finalize(() => {
          this.sending = false;
          this.editingMessageId = null;
        }))
        .subscribe(updatedMsg => {
          const index = this.messages.findIndex(m => m.id === this.editingMessageId);
          if (index !== -1) this.messages[index] = updatedMsg;
          this.newMessage = '';
        });
    } else {
      // حالة الإرسال الجديد (Create)
      this.chatService.sendMessage(input)
        .pipe(finalize(() => this.sending = false))
        .subscribe(msg => {
          this.messages.push(msg);
          this.newMessage = '';
          this.scrollToBottom();
        });
    }
  }

  // تحضير الرسالة للتعديل
  startEdit(msg: ChatMessageDto) {
    this.editingMessageId = msg.id;
    this.newMessage = msg.message;
  }

  cancelEdit() {
    this.editingMessageId = null;
    this.newMessage = '';
  }

  // حذف الرسالة
  deleteMsg(id: string) {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      this.chatService.deleteMessage(id).subscribe(() => {
        this.messages = this.messages.filter(m => m.id !== id);
      });
    }
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}