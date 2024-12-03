/*
 * SPDX-License-Identifier: Apache-2.0
 */

package main.java.org.example;

import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;
import org.json.JSONObject;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.Builder;
import lombok.Data;

@Builder
@Data
@DataType()
public class BirthCert {

    // Add a static ObjectMapper for convenience
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Property()
    private String value;

    @Property()
    private String doc_type = "BirthCertificate";

    @Property()
    private String name;

    @Property()
    private String father_name;

    @Property()
    private String mother_name;

    @Property()
    private String dob;

    @Property()
    private String gender;

    @Property()
    private String weight;

    @Property()
    private String country;

    @Property()
    private String state;

    @Property()
    private String city;

    @Property()
    private String hospital_name;

    @Property()
    private String permanent_address;

    public String toJSONString() throws JsonProcessingException {
        return OBJECT_MAPPER.writeValueAsString(this);
    }

    public static BirthCert fromJSONString(String json) throws JsonProcessingException {
        return OBJECT_MAPPER.readValue(json, BirthCert.class);
    }
}
