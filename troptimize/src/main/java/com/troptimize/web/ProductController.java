package com.troptimize.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.troptimize.beans.Product;
import com.troptimize.service.ProductService;

/**
 * @author m4ver1k
 *
 */
@RestController
@RequestMapping("/product")
public class ProductController {

	@Autowired
	ProductService productService;
	
	
	@RequestMapping("/search")
	public Page<Product> searchProduct(@RequestParam("q") String keyword,Pageable pageable){
		return productService.searchProduct(keyword, pageable);
	}
	
	@RequestMapping
	public Page<Product> getAll(Pageable pageable){
		return productService.findAll(pageable);
	}
	
	@RequestMapping("/{id}")
	public Product getDetailsPage(@PathVariable("id") String id){
		return productService.findById(id);
	}
}
