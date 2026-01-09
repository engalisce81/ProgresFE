import { CoreModule, ConfigStateService } from '@abp/ng.core';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '@proxy/dev/acadmy/chats';
import { CreateUpdateChatMessageDto } from '@proxy/dev/acadmy/dtos/request/chats';
import { ChatMessageDto } from '@proxy/dev/acadmy/dtos/response/chats';
import { finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-list-chat',
  standalone: true,
  imports: [CoreModule, CommonModule, NgIf, NgFor, FormsModule],
  templateUrl: './list-chat.component.html',
  styleUrl: './list-chat.component.scss'
})
export class ListChatComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  messages: ChatMessageDto[] = [];
  newMessage: string = '';
  receiverId: string = '';
  currentUserId: string = '';
  loading = false;
  sending = false;

  // متغيرات Pagination
  currentPage = 1;
  pageSize = 20;
  totalCount = 0;
  hasMoreMessages = true;
  isLoadingMore = false;

  // متغيرات خاصة بالتعديل
  editingMessageId: string | null = null;

  // متغير لتتبع ما إذا كان التمرير لأول مرة
  private initialLoad = true;
  private destroy$ = new Subject<void>();
  currentUserRoles: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private configState: ConfigStateService
  ) {
    const currentUser = this.configState.getOne("currentUser");
    this.currentUserId = currentUser.id;
    this.currentUserRoles = currentUser.roles || [];
  }

  ngOnInit(): void {
    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.receiverId = params['id']; 
        this.resetPagination();
        this.loadMessages();
      });
  }

  ngAfterViewChecked() {
    if (this.initialLoad && this.messages.length > 0) {
      this.scrollToBottom();
      this.initialLoad = false;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetPagination() {
    this.currentPage = 1;
    this.totalCount = 0;
    this.hasMoreMessages = true;
    this.messages = [];
    this.initialLoad = true;
  }

  loadMessages() {
    this.loading = true;
    this.chatService.getMessages(this.receiverId, this.currentPage, this.pageSize)
      .pipe(
        finalize(() => this.loading = false),
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        if (res.items && res.items.length > 0) {
          // عكس ترتيب الرسائل لأنها تأتي من الأحدث إلى الأقدم
          const reversedItems = [...res.items].reverse();
          
          if (this.currentPage === 1) {
            // الصفحة الأولى: نضع الرسائل بترتيب تصاعدي (من الأقدم إلى الأحدث)
            this.messages = reversedItems;
            // عند التحميل الأول، ننتظر قليلاً ثم نتمرر لأسفل
            setTimeout(() => this.scrollToBottom(), 100);
          } else {
            // الصفحات التالية: نضيف الرسائل القديمة في البداية
            this.messages = [...reversedItems, ...this.messages];
          }
          
          this.totalCount = res.totalCount || 0;
          
          // تحقق إذا كان هناك المزيد من الرسائل
          this.hasMoreMessages = this.messages.length < this.totalCount;
        }
      });
  }

   canDeleteMessage(msg: ChatMessageDto): boolean {
    // يمكن للمستخدم حذف رسائله الخاصة
    if (msg.senderId === this.currentUserId) {
      return true;
    }
    
    // الأدمن يمكنه حذف أي رسالة
    if (this.isAdmin()) {
      return true;
    }
    
    return false;
  }
isAdmin(): boolean {
    // ابحث عن role الـ admin في مصفوفة الأدوار
    // يمكن أن يكون 'admin' أو 'Admin' أو 'administrator' حسب إعداداتك
    return this.currentUserRoles.some(role => 
      role.toLowerCase().includes('admin') 
    );
  }
  // دالة للتحقق إذا كان يمكن تعديل الرسالة
  canEditMessage(msg: ChatMessageDto): boolean {
    // فقط المرسل يمكنه تعديل رسالته
    return msg.senderId === this.currentUserId;
  }
  loadMoreMessages() {
    if (this.isLoadingMore || !this.hasMoreMessages) return;

    this.isLoadingMore = true;
    this.currentPage++;

    // حفظ موقف التمرير قبل التحميل
    const currentScrollHeight = this.scrollContainer.nativeElement.scrollHeight;

    this.chatService.getMessages(this.receiverId, this.currentPage, this.pageSize)
      .pipe(
        finalize(() => this.isLoadingMore = false),
        takeUntil(this.destroy$)
      )
      .subscribe(res => {
        if (res.items && res.items.length > 0) {
          // عكس ترتيب الرسائل الجديدة
          const reversedItems = [...res.items].reverse();
          
          // إضافة الرسائل الجديدة في البداية (للتاريخ السابق)
          this.messages = [...reversedItems, ...this.messages];
          this.totalCount = res.totalCount || 0;
          this.hasMoreMessages = this.messages.length < this.totalCount;

          // الحفاظ على موقف التمرير بعد التحميل
          setTimeout(() => {
            const newScrollHeight = this.scrollContainer.nativeElement.scrollHeight;
            this.scrollContainer.nativeElement.scrollTop = newScrollHeight - currentScrollHeight;
          }, 0);
        }
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
        .pipe(
          finalize(() => {
            this.sending = false;
            this.editingMessageId = null;
          }),
          takeUntil(this.destroy$)
        )
        .subscribe(updatedMsg => {
          const index = this.messages.findIndex(m => m.id === this.editingMessageId);
          if (index !== -1) this.messages[index] = updatedMsg;
          this.newMessage = '';
        });
    } else {
      // حالة الإرسال الجديد (Create)
      this.chatService.sendMessage(input)
        .pipe(
          finalize(() => this.sending = false),
          takeUntil(this.destroy$)
        )
        .subscribe(msg => {
          // إضافة الرسالة الجديدة في النهاية (الأحدث)
          this.messages.push(msg);
          this.newMessage = '';
          this.totalCount++;
          
          // التمرير لأسفل لعرض الرسالة الجديدة
          setTimeout(() => this.scrollToBottom(), 100);
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
      this.chatService.deleteMessage(id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.messages = this.messages.filter(m => m.id !== id);
          // تقليل العدد الإجمالي للرسائل
          this.totalCount = Math.max(0, this.totalCount - 1);
          this.hasMoreMessages = this.messages.length < this.totalCount;
        });
    }
  }

  // دالة للتمرير لأسفل
  scrollToBottom(): void {
    try {
      setTimeout(() => {
        const element = this.scrollContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }, 0);
    } catch (err) {}
  }

  // دالة للتحقق إذا وصل المستخدم لأعلى الحاوية
  onScroll() {
    const element = this.scrollContainer.nativeElement;
    if (element.scrollTop === 0 && this.hasMoreMessages && !this.isLoadingMore) {
      this.loadMoreMessages();
    }
  }

  // دالة مساعدة للحصول على ترتيب الرسائل بشكل صحيح
  getSortedMessages(): ChatMessageDto[] {
    // تأكد من أن الرسائل مرتبة من الأقدم إلى الأحدث
    return [...this.messages].sort((a, b) => {
      return new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime();
    });
  }
}