import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { DataModelService } from '../data-model.service';
import { CustomerSortPipe } from './customer-sort.pipe';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { Header } from 'primeng/primeng';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { FileSelectDirective, FileDropDirective, FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload/ng2-file-upload';
import { DxDataGridComponent } from 'devextreme-angular';




@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  providers: [NgbAccordionConfig]
})
export class CustomerComponent implements OnInit {

  @ViewChild(DxDataGridComponent) dataGrid: DxDataGridComponent;

  customerForm: FormGroup;
  customers: any[];
  customer: any;
  selectedCustomer: any;
  selection: any;
  modal: any;
  itemControl = new FormControl();
  input: string;
  check = false;
  topics: any[];
  topic: any;
  employees: any;
  topicForm: FormGroup;
  topicModal: any;
  customerId: number;
  selectedTopic: any;
  request: any;
  requests: DataSource;
  selected = false;
  editMode: boolean;
  requestForm: FormGroup;
  requestModal: any;
  file: any;
  files: any[];
  uploader: any;
  editable: boolean;
  isCompleted: boolean;
  response: any;
  responseMessage: string;
  error: boolean;
  states = [{ id: 0, value: 'Chờ phân tích' }, { id: 1, value: 'Chờ phân công' },
  { id: 2, value: 'Chờ xử lý' }, { id: 3, value: 'Chờ kiểm tra' },
  { id: 4, value: 'Hoàn thành' }]



  constructor(private fb: FormBuilder, private ngbModal: NgbModal,
    private service: DataModelService) { }

  ngOnInit() {
    //  this.uploader = new FileUploader({ url: 'http://localhost:61028/breeze/datamodel/import' });
    this.uploader = new FileUploader({ url: 'http://192.168.11.32:5555/breeze/datamodel/import' });

    this.service.fetchMetadata().then(() => {
      this.service.getFiles().then(data => this.files = data[0]);

      this.service.getEmployees().then(data => this.employees = data[0]);
      this.service.sortCustomers().then(data => this.customers = data[0]);
      console.log(this.files);
    });
    this.customerForm = this.fb.group({
      Name: '',
      Address: '',
      Team: '',
      Version: '',
      SqlVersion: '',
      IsCompleted: '',
      Info: ''
    });
    this.itemControl.valueChanges
      .debounceTime(500)
      .distinctUntilChanged()
      .subscribe(string => {
        this.input = string;
        this.search(this.input);
      });
  }

  open(response, content, customer) {
    this.response = response;
    this.modal = this.ngbModal.open(content);
    if (!customer) {
      this.selection = 1;
      this.customerForm = this.fb.group({
        Name: '',
        Address: '',
        Team: '',
        Version: '',
        SqlVersion: '',
        IsCompleted: '',
        Info: ''
      });

    } else {
      this.selection = 2;
      this.customer = customer;
      this.customerForm.patchValue({
        Name: this.customer.Name,
        Address: this.customer.Address,
        Team: this.customer.Team,
        Version: this.customer.Version,
        SqlVersion: this.customer.SqlVersion,
        Info: this.customer.Info
      })
    }
    this.response = response;

  }

  send() {
    if (this.selection === 1) {
      this.customer = {};
      Object.assign(this.customer, this.customerForm.value);
      this.customer.entityState = 'Added';
      this.service.createCustomer(this.customer);
      this.saveChanges().then(res => {
        this.customers.push(res[0]);
        this.customers = this.customers.slice();
        this.ngbModal.open(this.response);
        this.responseMessage = `Tạo khách hàng mới thành công`;
        this.modal.close();
      }).catch(() => this.service.rejectChanges());
    } else {
      Object.assign(this.customer, this.customerForm.value);
      this.saveChanges().then(res => {
        this.customers = this.customers.slice()
        this.ngbModal.open(this.response);
        this.responseMessage = `Sửa thông tin thành công`;
        this.modal.close();
      })
        .catch(() => this.service.rejectChanges());
    }
  }

  search(input) {
    this.service.getCustomerByName(input).then(res => this.customers = res)
  }

  saveChanges() {
    return this.service.saveChanges();
  }

  delete(response, customer, confirm) {
    this.response = response;
    this.customer = customer;
    console.log(this.customer);
    const i = this.customers.indexOf(this.customer);
    console.log(i);

    this.ngbModal.open(confirm).result
      .then(() => {
        this.customer.entityAspect.setDeleted();
        this.saveChanges().then(() => {
          this.ngbModal.open(this.response);
          this.responseMessage = 'Xóa khách hàng thành công';
          this.customers.splice(i, 1);
          this.customer = null;
        })
      }).catch(() => this.ngbModal.open(confirm).close());

  }

  select(element) {
    this.check = true;
    this.service.getCustomerByID(element.Id).then(data => this.customer = data[0]);
    this.service.getTopicsByCustomer(element.Id).then(data => this.topics = data);
    this.customerId = element.Id;
  }

  createNew(response, topic) {
    this.topic = {};
    this.topicModal = this.ngbModal.open(topic);
    this.topicForm = this.fb.group({
      Name: '',
      CustomerId: this.customerId,
    })
    this.response = response;
  }

  addTopic() {
    Object.assign(this.topic, this.topicForm.value);
    this.service.createTopic(this.topic);
    this.service.saveChanges().then(entities => {
      this.topics.push(entities[0]);
      this.ngbModal.open(this.response);
      this.responseMessage = 'Tạo nội dung mới thành công';
      this.topicModal.close();
    }).catch(error => {
      console.log(error);
      this.service.rejectChanges();
    })
  }

  selectTopic(topic) {
    this.selected = true;
    this.selectedTopic = topic;
    this.requests = new DataSource({
      store: new CustomStore({
        load: () => {
          return this.service.getRequestByTopic(topic.Id).then(data => {
            return {
              data: data
            }
          })
        },
        // update: (key, values) => {
        //   key.entityAspect.setModified();
        //   return this.service.saveChanges([key]).then(() => alert('success')).catch(error => this.service.rejectChanges())
        // }
      })
    });
  }

  createRequest(response, request, id) {
    console.log(id);
    this.editMode = false;
    this.request = {};
    this.requestModal = this.ngbModal.open(request);
    this.requestForm = this.fb.group({
      Code: [{ value: '', disabled: true }],
      TopicId: id,
      DateCreated: [{ value: '', disabled: true }],
      DesignDateExpired: '',
      CodeDateExpired: '',
      Description: '',
      DevDescription: '',
      FromEmployeeId: '',
      ToEmployeeId: '',
      DoEmployeeId: '',
      State: '',
    });
    this.response = response;
  }

  uploadFile() {
    this.file = {};
    this.upload().then(task => {
      this.file.FileName = task[0].FileName;
      this.file.FilePath = task[0].FilePath;
      this.service.createSourceFile(this.file);
      this.service.saveChanges().then(res => this.request.DescriptionFileId = res[0].Id);
    }).catch(error => console.log(error));
  }

  upload(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) =>
        resolve(JSON.parse(response));


      this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
        reject();
      }
      this.uploader.uploadAll();
    });
  }

  sendRequest() {
    Object.assign(this.request, this.requestForm.value);

    if (!this.editMode) {
      this.service.createCustomerRequest(this.request);
    }
    this.service.saveChanges().then(() => {
      this.ngbModal.open(this.response);
      this.responseMessage = this.editMode ? 'Cập nhật yêu cầu thành công' : 'Tạo mới yêu cầu thành công';
      this.requestModal.close();

      this.dataGrid.instance.refresh();

    }).catch(error => {
      this.error = true;
      this.ngbModal.open(this.response);
      this.service.rejectChanges();
    });
  }

  selectRequest(code, modal) {
    this.isCompleted = false;
    this.editable = true;
    this.editMode = true;
    this.service.getRequestByCode(code).then(res => {
      this.request = res[0];
      // console.log(this.request);
      this.requestModal = this.ngbModal.open(modal);
      if (this.request.State !== 0) {
        this.editable = false;
      }

      if (this.request.State === 4) {
        this.isCompleted = true;
      }

      this.requestForm = this.fb.group({
        Code: [{ value: code, disabled: true }],
        DateCreated: [{ value: '', disabled: true }],
        TopicId: [{ value: '', disabled: true }],
        DesignDateExpired: [{ value: '', disabled: !this.editable }],
        CodeDateExpired: [{ value: '', disabled: !this.editable }],
        Description: [{ value: '', disabled: !this.editable }],
        DevDescription: [{ value: '', disabled: !this.editable }],
        FromEmployeeId: [{ value: '', disabled: !this.editable }],
        ToEmployeeId: [{ value: '', disabled: !this.editable }],
        DoEmployeeId: [{ value: '', disabled: this.isCompleted }],
        State: [{ value: '', disabled: this.isCompleted }],
      })
      this.requestForm.patchValue({
        Code: this.request.Code,
        TopicId: this.request.TopicId,
        DateCreated: this.request.DateCreated,
        DesignDateExpired: this.request.DesignDateExpired,
        CodeDateExpired: this.request.CodeDateExpired,
        Description: this.request.Description,
        DevDescription: this.request.DevDescription,
        FromEmployeeId: this.request.FromEmployeeId,
        ToEmployeeId: this.request.ToEmployeeId,
        DoEmployeeId: this.request.DoEmployeeId,
        State: this.request.State
      })
    });
  }
}
