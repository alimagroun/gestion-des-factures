package com.magroun.gestiondesfactures.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.magroun.gestiondesfactures.service.ExcelService;

@RestController
@RequestMapping("/api/excel")
public class ExcelController {
	
	  @Autowired
	  ExcelService fileService;

	  @GetMapping("/download-customers")
	  public ResponseEntity<Resource> getFile() {
	    String filename = "customers.xlsx";
	    InputStreamResource file = new InputStreamResource(fileService.load());

	    return ResponseEntity.ok()
	        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
	        .contentType(MediaType.parseMediaType("application/vnd.ms-excel")).body(file);
	  }

}
