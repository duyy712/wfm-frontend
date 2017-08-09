import { Injectable } from '@angular/core';
import { EntityManager, EntityQuery, config, EntityState, MergeStrategy, EntityType, FilterQueryOp } from 'breeze-client';
import { AjaxAngularAdapter } from 'breeze-bridge-angular';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
// import { Table, Column} from '../object/object';

@Injectable()

export class DataModelService {
  private entityManager: EntityManager;
  private apiUrl = 'http://localhost:61028/breeze/datamodel';
  initPromise: Promise<any>;
  store: any;
  properties: any;

  constructor(private http: Http) {
    config.registerAdapter('ajax', () => new AjaxAngularAdapter(http));
    config.initializeAdapterInstance('ajax', AjaxAngularAdapter.adapterName, true);
    this.entityManager = new EntityManager(this.apiUrl);
    this.initPromise = this.entityManager.metadataStore.isEmpty() ? this.entityManager.fetchMetadata() : Promise.resolve();

  }

  fetchMetadata() {
    return this.entityManager.fetchMetadata();
  }

  createEntity(entityType: string, initial?: any): any {
    return this.entityManager.createEntity(entityType, initial);
  }

  createCustomerRequest(initial?: any) {
    return this.createEntity('CustomerRequest', initial);
  }
  createCustomer(initial?: any) {
    return this.createEntity('Customer', initial);
  }

  createSourceFile(initial?: any) {
    return this.createEntity('SourceFile', initial);
  }

  sortCustomers() {
    return this.getEntity('Customers', {
      orderBy: ['Name asc']
    })
  }

  createTopic(initial?: any) {
    return this.createEntity('Topic', initial);
  }

  saveChanges(entities?: any[]): Promise<any> {
    return <Promise<any[]>><any>this.entityManager.saveChanges(entities)
      .then(res => res.entities)
      .catch(error => Promise.reject(error));
  }

  getEntity(entityType: string, option?: any): Promise<any> {
    const queryOptions = Object.assign({ from: entityType }, option);
    const query = new EntityQuery(queryOptions);
    return <Promise<any>><any>this.entityManager.executeQuery(query)
      .then(res => [res.results, res.inlineCount])
      .catch(error => Promise.reject(error));
  }

  getCustomers(options?: any): Promise<any> {
    return this.getEntity('Customers', options);
  }

  getEmployees(options?: any): Promise<any> {
    return this.getEntity('Employees', options);
  }
  getFiles(options?: any): Promise<any> {
    return this.getEntity('SourceFiles', options);
  }

  getRequestByTopic(id: number): Promise<any> {
    return this.getEntity('CustomerRequests', {
      where: {
        TopicId: id
      },
    }).then(tables => tables[0]);
  }
  getCustomerByID(id: number): Promise<any> {
    return this.getEntity('Customers', {
      where: {
        Id: id
      },
    }).then(customer => customer[0]);
  }
  getTopicsByCustomer(id: number): Promise<any> {
    return this.getEntity('Topics', {
      where: {
        CustomerId: id
      },
    }).then(Topics => Topics[0])
  }


  getRequestByCode(code): Promise<any> {
    return this.getEntity('CustomerRequests', {
      where: {
        Code: code
      },
    }).then(tables => tables[0]);
  }

  rejectChanges() {
    return this.entityManager.rejectChanges();
  }

  getCustomerByName(name: string): Promise<any> {
    const queryOptions = {
      from: 'Customers'
    };
    const query = new EntityQuery(queryOptions).where('Name', FilterQueryOp.Contains, name)
      .orderBy('Name', false);
    return this.entityManager.executeQuery(query)
      .then(res => res.results)
      .catch((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }
  // getColumnAndPaging(id: number, pageSize: number, pageIndex: number, str: string) {
  //     return this.getEntity('Columns', {
  //         where: {
  //             'TableID': id,
  //             'Name': { Contains: str }
  //         },
  //         // select: 'Columns',
  //         orderBy: ['ID asc'],
  //         skip: pageSize * (pageIndex - 1),
  //         take: pageSize,
  //         inlineCount: true,
  //     });
  // }
}




