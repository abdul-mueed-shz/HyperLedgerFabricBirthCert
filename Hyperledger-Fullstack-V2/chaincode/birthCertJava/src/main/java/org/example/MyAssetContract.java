/*
 * SPDX-License-Identifier: Apache-2.0
 */
package main.java.org.example;

import main.java.org.example.BirthCert;
import org.hyperledger.fabric.contract.Context;
import org.hyperledger.fabric.contract.ContractInterface;
import org.hyperledger.fabric.contract.annotation.Contract;
import org.hyperledger.fabric.contract.annotation.Default;
import org.hyperledger.fabric.contract.annotation.Transaction;

import com.fasterxml.jackson.core.JsonProcessingException;

import org.hyperledger.fabric.contract.annotation.Contact;
import org.hyperledger.fabric.contract.annotation.Info;
import org.hyperledger.fabric.contract.annotation.License;
import static java.nio.charset.StandardCharsets.UTF_8;

@Contract(name = "MyAssetContract", info = @Info(title = "BirthCert contract", description = "Very basic Java Contract example", version = "0.0.1", license = @License(name = "SPDX-License-Identifier: Apache-2.0", url = ""), contact = @Contact(email = "MyAssetContract@example.com", name = "MyAssetContract", url = "http://MyAssetContract.me")))
@Default
public class MyAssetContract implements ContractInterface {
    public MyAssetContract() {
        // This will be filled later
    }

    @Transaction()
    public void initLedger(Context ctx) {
        System.out.println("============= START : Initialize Ledger ===========");
        System.out.println("============= END : Initialize Ledger ===========");
    }

    @Transaction
    public void createBirthCert(
            Context ctx,
            String id,
            String name,
            String father_name,
            String mother_name,
            String dob,
            String gender,
            String weight,
            String country,
            String state,
            String city,
            String hospital_name,
            String permanent_address) throws JsonProcessingException {
        BirthCert birthCert = BirthCert.builder()
                .name(hospital_name)
                .city(city)
                .country(country)
                .weight(weight)
                .dob(dob)
                .doc_type("Birth Certificate")
                .father_name(father_name)
                .mother_name(mother_name)
                .gender(gender)
                .hospital_name(hospital_name)
                .permanent_address(permanent_address)
                .build();
        ctx.getStub().putState(id, birthCert.toJSONString().getBytes(UTF_8));
    }
    // @Transaction()
    // public boolean myAssetExists(Context ctx, String myAssetId) {
    // byte[] buffer = ctx.getStub().getState(myAssetId);
    // return (buffer != null && buffer.length > 0);
    // }

    // @Transaction()
    // public void createMyAsset(Context ctx, String myAssetId, String value) {
    // boolean exists = myAssetExists(ctx,myAssetId);
    // if (exists) {
    // throw new RuntimeException("The asset "+myAssetId+" already exists");
    // }
    // BirthCert asset = new BirthCert();
    // asset.setValue(value);
    // ctx.getStub().putState(myAssetId, asset.toJSONString().getBytes(UTF_8));
    // }

    // @Transaction()
    // public BirthCert readMyAsset(Context ctx, String myAssetId) {
    // boolean exists = myAssetExists(ctx,myAssetId);
    // if (!exists) {
    // throw new RuntimeException("The asset "+myAssetId+" does not exist");
    // }

    // BirthCert newAsset = BirthCert.fromJSONString(new
    // String(ctx.getStub().getState(myAssetId),UTF_8));
    // return newAsset;
    // }

    // @Transaction()
    // public void updateMyAsset(Context ctx, String myAssetId, String newValue) {
    // boolean exists = myAssetExists(ctx,myAssetId);
    // if (!exists) {
    // throw new RuntimeException("The asset "+myAssetId+" does not exist");
    // }
    // BirthCert asset = new BirthCert();
    // asset.setValue(newValue);

    // ctx.getStub().putState(myAssetId, asset.toJSONString().getBytes(UTF_8));
    // }

    // @Transaction()
    // public void deleteMyAsset(Context ctx, String myAssetId) {
    // boolean exists = myAssetExists(ctx,myAssetId);
    // if (!exists) {
    // throw new RuntimeException("The asset "+myAssetId+" does not exist");
    // }
    // ctx.getStub().delState(myAssetId);
    // }

}