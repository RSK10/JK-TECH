import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let service: DocumentService;
  let httpMock: HttpTestingController;

  const mockDocuments = [
    { id: 'c97a', fileName: 'Ramzan Kadar - Resume.pdf', description: 'Document 1', addedBy: 'admin' },
    { id: 'f63b', fileName: 'Test Document - Overview.pdf', description: 'Document 2', addedBy: 'user' }
  ];

  const newDocument = { fileName: 'Document 3', description: 'Document 3 Description', addedBy: 'admin' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DocumentService]
    });

    service = TestBed.inject(DocumentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should retrieve documents from the API', () => {
    service.getDocuments().subscribe((documents) => {
      expect(documents.length).toBe(2);
      expect(documents).toEqual(mockDocuments);
    });

    const req = httpMock.expectOne('http://localhost:3000/Documents');
    expect(req.request.method).toBe('GET');
    req.flush(mockDocuments);
  });

  it('should add a new document to the API', () => {
    const addedDocument = { ...newDocument, id: 'c97a' };

    service.addDocument(newDocument).subscribe((response) => {
      expect(response).toEqual(addedDocument);
    });

    const req = httpMock.expectOne('http://localhost:3000/Documents');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newDocument);
    req.flush(addedDocument);
  });

  it('should delete the document from the API', () => {
    const documentId = 'c97a';

    service.deleteDocument(documentId).subscribe((response) => {
      expect(response).toEqual({ message: 'Document deleted' });
    });

    const req = httpMock.expectOne(`http://localhost:3000/Documents/${documentId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({ message: 'Document deleted' });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
