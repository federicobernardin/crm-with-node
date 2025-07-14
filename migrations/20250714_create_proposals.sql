-- migrations/20250714_create_proposals.sql

CREATE TABLE proposals (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  language        VARCHAR(10)    NOT NULL,
  type            VARCHAR(100)   NOT NULL,
  client_id       INT            NOT NULL,
  code            VARCHAR(50)    UNIQUE NOT NULL,
  date            DATE           NOT NULL,
  author          VARCHAR(255)   NOT NULL,
  title           VARCHAR(255)   NOT NULL,
  revenue         DECIMAL(15,2)  DEFAULT 0,
  version         VARCHAR(20)    DEFAULT '1.0',
  notes           TEXT,
  tranche         VARCHAR(50),
  new_customer    BOOLEAN        DEFAULT FALSE,
  payment         VARCHAR(100),
  start_at        DATE,
  stop_at         DATE,
  estimation_end  DATE,
  created_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_proposals_client
    FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE proposal_contacts (
  proposal_id INT NOT NULL,
  contact_id  INT NOT NULL,
  PRIMARY KEY (proposal_id, contact_id),
  CONSTRAINT fk_pc_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE CASCADE,
  CONSTRAINT fk_pc_contact  FOREIGN KEY (contact_id)  REFERENCES contacts(id)  ON DELETE CASCADE
) ENGINE=InnoDB;
