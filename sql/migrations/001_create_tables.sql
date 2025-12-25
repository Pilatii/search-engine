CREATE TABLE documents (
	id UUID PRIMARY KEY,
	content TEXT NOT NULL,
	create_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE terms (
	id SERIAL PRIMARY KEY,
	term TEXT NOT NULL UNIQUE
);

CREATE TABLE documents_terms (
	document_id UUID NOT NULL,
	term_id INT NOT NULL,
	frequency INT NOT NULL,
	PRIMARY KEY (document_id, term_id),
	FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
	FOREIGN KEY (term_id) REFERENCES terms(id) ON DELETE CASCADE
);

CREATE INDEX idx_terms_term ON terms(term);
CREATE INDEX idx_document_terms_term ON documents_terms(term_id);