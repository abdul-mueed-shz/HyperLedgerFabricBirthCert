/*
SPDX-License-Identifier: Apache-2.0
*/

package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing contracts
type SmartContract struct {
	contractapi.Contract
}

// Basic definition for contract schema
type LegalContractSchema struct {
	DocType      string   `json:"docType"`
	Description  string   `json:"description"`
	Participants []string `json:"participants"`
}

// QueryResult structure used for handling result of query
type QueryResult struct {
	Key    string `json:"key"`
	Record *LegalContractSchema
}

// InitLedger adds a base set of contracts to the ledger
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {
	fmt.Printf("============= START : Initialize Ledger ===========")
	fmt.Printf("============= END : Initialize Ledger ===========")
	return nil
}

// CreateContract creates a contract schema on world state
func (s *SmartContract) CreateContract(ctx contractapi.TransactionContextInterface, contractId string, client string, supplier string, description string) (string, error) {

	if contractId == "" {
		return "", fmt.Errorf("Contract Id cannot be empty.")
	}
	if client == "" {
		return "", fmt.Errorf("Client field cannot be empty.")
	}
	if supplier == "" {
		return "", fmt.Errorf("Supplier field cannot be empty.")
	}

	chatAsBytes, err := ctx.GetStub().GetState(contractId)
	if err != nil {
		return "", fmt.Errorf("Failed to read from world state. %s", err.Error())
	}

	if chatAsBytes == nil { // Contract doesnt exist so we can create one
		newContract := LegalContractSchema{DocType: "Legal Contract", Participants: []string{client, supplier}, Description: description}
		newContractAsBytes, _ := json.Marshal(newContract)
		err := ctx.GetStub().PutState(contractId, newContractAsBytes)

		if err != nil {
			return "", fmt.Errorf("Failed writing to world state. %s", err.Error())
		}
		return "Successfully created contract", nil

	} else { // Contract already exist so throw error
		return "", fmt.Errorf("Failed to create contract schema, contract already exists.")

	}

}

func (s *SmartContract) GetLegalContractCert(ctx contractapi.TransactionContextInterface, id string) (string, error) {
	// Retrieve the legal contract certificate from the ledger using the provided ID
	legalContractCertAsBytes, err := ctx.GetStub().GetState(id)
	if err != nil {
		return "", fmt.Errorf("failed to read legal contract certificate with ID %s from world state: %v", id, err)
	}

	// Check if the record exists
	if legalContractCertAsBytes == nil {
		return "", fmt.Errorf("legal contract certificate with ID %s does not exist", id)
	}

	// Return the legal contract certificate as a string
	return string(legalContractCertAsBytes), nil
}

// AllList retrieves all legal contract certificates from the ledger
func (s *SmartContract) AllList(ctx contractapi.TransactionContextInterface) ([]QueryResult, error) {
	// Define the query string to match all records with the docType "Legal Contract"
	queryString := `{
		"selector": {
			"docType": "Legal Contract"
		}
	}`

	// Execute the query
	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, fmt.Errorf("failed to execute query: %v", err)
	}
	defer resultsIterator.Close()

	// Parse the query results
	var results []QueryResult
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, fmt.Errorf("failed to iterate over query results: %v", err)
		}

		var legalContract LegalContractSchema
		err = json.Unmarshal(queryResponse.Value, &legalContract)
		if err != nil {
			return nil, fmt.Errorf("failed to unmarshal contract data: %v", err)
		}

		queryResult := QueryResult{
			Key:    queryResponse.Key,
			Record: &legalContract,
		}

		results = append(results, queryResult)
	}

	return results, nil
}

func main() {

	chaincode, err := contractapi.NewChaincode(new(SmartContract))

	if err != nil {
		fmt.Printf("Error create contract-app chaincode: %s", err.Error())
		return
	}

	if err := chaincode.Start(); err != nil {
		fmt.Printf("Error starting contract-app chaincode: %s", err.Error())
	}
}
