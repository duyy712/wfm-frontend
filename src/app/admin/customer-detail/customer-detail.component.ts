import { Component, OnInit } from '@angular/core';
import { DataModelService } from '../data-model.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DxDataGridModule, DxDataGridComponent, DxButtonModule } from 'devextreme-angular';
import DataSource from 'devextreme/data/data_source';
import CustomStore from 'devextreme/data/custom_store';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FileSelectDirective, FileDropDirective, FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload/ng2-file-upload';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  customer: any;
  customerId: number;
  request: any = {}
  requests: any;
  employees: any[];
  requestForm: FormGroup;
  topicForm: FormGroup;
  topicId: number;
  topic: any;
  topics: any[];
  topicModal: any;
  selectedTopic: any;
  selected = false;
  requestModal: any;
  editable: boolean;
  task: any;
  editMode = false;
  uploader: FileUploader;
  file: any;
  states = [{ id: 0, value: 'Chờ phân tích' }, { id: 1, value: 'Chờ phân công' },
  { id: 2, value: 'Chờ xử lý' }, { id: 3, value: 'Chờ kiểm tra' },
  { id: 4, value: 'Hoàn thành' }]

  constructor(private service: DataModelService,
    private router: Router,
    private route: ActivatedRoute,
    private ngbModal: NgbModal,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.uploader = new FileUploader({ url: 'http://localhost:61028/breeze/datamodel/import' });
    // this.uploader.onErrorItem = (item, response, status, headers) => this.onErrorItem(item, response, status, headers);
    // this.uploader.onSuccessItem = (item, response, status, headers) => this.onSuccessItem(item, response, status, headers);

    this.route.params.subscribe(params => this.customerId = params['id']);
    this.service.getCustomerByID(this.customerId).then(data => this.customer = data[0]);
    this.service.getTopicsByCustomer(this.customerId).then(data => this.topics = data);
    this.service.getEmployees().then(data => this.employees = data[0]);
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

  create(topic) {
    this.topic = {};
    this.topicModal = this.ngbModal.open(topic);
    this.topicForm = this.fb.group({
      Name: '',
      CustomerId: this.customerId,
    })
  }

  addTopic() {
    Object.assign(this.topic, this.topicForm.value);
    // console.log(this.topic);
    this.service.createTopic(this.topic);
    this.service.saveChanges().then(entities => {
      this.topics.push(entities[0]);
      // alert('Topic add successfully');
      this.topicModal.close();
    }).catch(error => {
      console.log(error);
      this.service.rejectChanges();
    })
  }


  createRequest(request, topic) {
    this.editMode = false;
    this.request = {};
    this.requestModal = this.ngbModal.open(request);
    this.requestForm = this.fb.group({
      Code: [{ value: '', disabled: true }],
      TopicId: topic.Id,
      DateCreated: [{ value: '', disabled: true }],
      DesignDateExpired: ['', Validators.required],
      CodeDateExpired: '',
      Description: '',
      DevDescription: '',
      FromEmployeeId: '',
      ToEmployeeId: '',
      DoEmployeeId: '',
      State: '',
    })
  }

  selectRequest(code, modal) {

    this.editable = true;
    this.editMode = true;
    this.service.getRequestByCode(code).then(res => {
      this.request = res[0];
      // console.log(this.request);
      this.requestModal = this.ngbModal.open(modal);
      if (this.request.State !== 0) {
        this.editable = false;
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
        DoEmployeeId: [{ value: '' }],
        State: [{ value: '' }],
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

  uploadFile() {
    this.file = {};
    this.upload().then(task => {
      this.file.FileName = task[0].FileName;
      this.file.FilePath = task[0].FilePath;
      this.service.createSourceFile(this.file);
      this.service.saveChanges().then(res => this.request.DescriptionFileId = res[0].Id);
    }).catch(error => console.log(error));
  }

  send() {
    Object.assign(this.request, this.requestForm.value);

    if (!this.editMode) {
      this.service.createCustomerRequest(this.request);
    }
    this.service.saveChanges().then(() => {
      alert('success');
      this.requestModal.close();
    }).catch(error => {
      this.service.rejectChanges();
      console.log(error.entityErrors)
    });
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

}

