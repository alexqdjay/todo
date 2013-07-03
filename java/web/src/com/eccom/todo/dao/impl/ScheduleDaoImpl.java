/**
 * 
 */
package com.eccom.todo.dao.impl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import com.eccom.todo.dao.ScheduleDao;

/**
 * @author alex
 *
 */
@Repository
public class ScheduleDaoImpl implements ScheduleDao {

	public DataSource dataSource;
	private JdbcTemplate jdbcTemplate;
	
	public DataSource getDataSource() {
		return dataSource;
	}
	
	@Autowired
	public void setDataSource(DataSource dataSource) {
		this.dataSource = dataSource;
		this.jdbcTemplate = new JdbcTemplate(dataSource);
		
	}

	@SuppressWarnings("unchecked")
	@Override
	public Map<String, Object> findOne(int id) {
		String sql = "select s.*,u.name as name,u.mail,cu.name as createuser " +
				"from schedule s left join user u on s.user_id=u.id " +
				"left join user cu on s.createby=cu.id where s.id=?";
		RowMapper<Map<String, Object>> mapper = new RowMapper<Map<String,Object>>() {

			@Override
			public Map<String, Object> mapRow(ResultSet res, int row)
					throws SQLException {
				Map<String,Object> map = new HashMap<String, Object>();
				map.put("id",res.getInt("id"));
				map.put("subject",res.getString("subject"));
				map.put("createuser",res.getString("createuser"));
				map.put("desc",res.getString("desc"));
				map.put("name",res.getString("name"));
				map.put("mail",res.getString("mail"));
				return map;
			}
			
		};
		@SuppressWarnings("rawtypes")
		List list = jdbcTemplate.query(sql, new Object[]{id}, mapper);
		if(list != null && list.size()>0) {
			return (Map<String, Object>) list.get(0);
		} 
		else {
			return null;
		}
	}

}
