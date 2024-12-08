package com.abdul.legalcontract;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.hyperledger.fabric.gateway.*;
import org.hyperledger.fabric.sdk.Enrollment;
import org.hyperledger.fabric.sdk.security.CryptoSuite;
import org.hyperledger.fabric_ca.sdk.HFCAClient;
import org.hyperledger.fabric_ca.sdk.exception.EnrollmentException;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.TimeoutException;

@SpringBootApplication
public class LegalcontractApplication {

    public static void main(String[] args) throws Exception, EnrollmentException {
        SpringApplication.run(LegalcontractApplication.class, args);

        Path walletDirectory = getOrCreateFolder("wallet");
        Wallet wallet = Wallets.newFileSystemWallet(walletDirectory);


        File connectionFile = null;
        connectionFile = new ClassPathResource("fabric/connection.json").getFile();
        Path networkConfigFile = connectionFile.toPath();

        // Check if "admin" identity exists
        String identityName = "admin";
        if (!identityExists(wallet, identityName)) {
            System.out.println("Identity does not exist. Creating a new identity...");
            createIdentityFromConnectionFile(wallet, identityName, networkConfigFile);
        }

        Gateway.Builder builder = null;
        builder = Gateway.createBuilder()
                .identity(wallet, "admin")
                .networkConfig(networkConfigFile);

        try (Gateway gateway = builder.connect()) {
            System.setProperty("org.hyperledger.fabric.sdk.channel.block.delivery.timeout", "30000"); // 30 seconds
            System.setProperty("grpc.NettyChannelBuilderOption.keepAliveTime", "120000"); // 2 minutes
            System.setProperty("grpc.NettyChannelBuilderOption.keepAliveTimeout", "20000"); // 20 seconds
            Network network = gateway.getNetwork("mychannel");
            Contract contract = network.getContract("legalContract");
            byte[] createCarResult = contract.createTransaction("CreateContract")
                    .submit("1123213124123", "VW", "Polo", "213123");
//            System.out.println(new String(createCarResult, StandardCharsets.UTF_8));
//            byte[] queryAllCarsResult = contract.evaluateTransaction("GetLegalContractCert");
//            System.out.println(new String(queryAllCarsResult, StandardCharsets.UTF_8));
            System.out.println(network);
        } catch (Exception e) {
            System.out.println(e.getMessage());
        }
    }

    public static void createIdentityFromConnectionFile(Wallet wallet, String identityName, Path connectionFilePath) throws Exception, EnrollmentException {
        // Parse the connection.json file
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode connectionJson = objectMapper.readTree(connectionFilePath.toFile());

        // Extract the MSP ID
        String mspId = connectionJson.get("organizations").get("Org1").get("mspid").asText();

        // Extract the certificate and private key from certificateAuthorities
        JsonNode caNode = connectionJson.get("certificateAuthorities").get("ca.org1.example.com");
        String certificate = caNode.get("tlsCACerts").get("pem").get(0).asText(); // Extract the certificate
        String privateKey = ""; // The private key needs to be added to the connection.json file

        Properties properties = new Properties();
        properties.put("pemBytes", certificate.getBytes("UTF-8")); // Convert String to byte[]
        properties.put("allowAllHostNames", "true"); // Disable hostname verification (equivalent to verify: false in Node.js)

        HFCAClient caClient = HFCAClient.createNewInstance(
                caNode.get("caName").asText(),
                caNode.get("url").asText(),
                properties);

        caClient.setCryptoSuite(CryptoSuite.Factory.getCryptoSuite());
        Enrollment enrollment = caClient.enroll("admin", "adminpw");

        X509Certificate x509Certificate = Identities.readX509Certificate(enrollment.getCert());
        PrivateKey privateKeyObj = enrollment.getKey();

        Identity identity = Identities.newX509Identity(mspId, x509Certificate, privateKeyObj);

        wallet.put(identityName, identity);
        System.out.println("New identity added to the wallet: " + identityName);
    }

    // Check if an identity exists in the wallet
    private static boolean identityExists(Wallet wallet, String identityName) throws IOException {
        Set<String> identities = wallet.list();
        return identities.contains(identityName);
    }

    public static Path getOrCreateFolder(String folderName) throws URISyntaxException, IOException {
        // Get the resource folder path (if it exists)
        Path resourceFolderPath;
        if (ClassLoader.getSystemResource(folderName) != null) {
            resourceFolderPath = Path.of(ClassLoader.getSystemResource(folderName).toURI());
        } else {
            // If the folder doesn't exist, create it in the target/classes directory
            resourceFolderPath = Paths.get("resources", folderName);

            // Ensure parent directories exist
            Files.createDirectories(resourceFolderPath);
        }

        return resourceFolderPath;
    }
}
